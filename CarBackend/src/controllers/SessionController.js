const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function login(req, res) {
  const { email, password, rememberMe } = req.body;

  try {
    const user = User.findOne({ where: { email } });
    const passwordsMatch = await argon2.verify(user.password, password);

    // se não encontrarmos um usuário com esse email ou as senhas não correspondem
    if (!user || !passwordsMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    /*
     * se o usuário marcar a opção remember me no formulário daremos a ele um token
     * com validade de 30 dias. Caso contrário, o token terá validade de 1 hora.
     */
    const expTime = rememberMe ? "30d" : "1h";

    // usamos a biblioteca para gerar o token
    // OBS: o melhor uso da biblioteca requer o uso de um segredo, passado como segundo argumento
    const token = jwt.sign(
      { id: user.id, validFor: expTime },
      process.env.JWT_KEY,
      { algorithm: "RS256", expiresIn: expTime }
    );

    // Enviamos o token para o usuário, pois a autenticação foi feita com sucesso
    return res.status(200).json({ token });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao validar credenciais" });
  }
}

function verify(req, res) {
  // o token deve ser enviado por meio da Authorization nos headers da requisição
  const { Authorization } = req.headers;

  /*
   *	verificamos algumas condições antes de usar a biblioteca para poupar recursos
   *	pois pequenas verificações custam menos que a verificação feita pela biblioteca
   */

  if (!Authorization) {
    return res.status(401).json({ error: "Requisição sem token de acesso" });
  }

  // O token deve ser do tipo: "bearer token"
  const [prefix, token] = split(Authorization, " ");

  if (prefix != "bearer" || !token) {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // pega quanto tempo de acesso o usuário ainda tem com esse token
    const remainingMinutes =
      (new Date(decoded.exp * 1000) - new Date()) / (1000 * 60);

    // se estiver quase expirando retornamos um novo token com mesmo periodo de expiração ao usuário
    if (remainingMinutes > 0 && remainingMinutes < 10) {
      token = jwt.sign(
        { id: decoded.id, validFor: decoded.validFor },
        process.env.JWT_KEY,
        { algorithm: "RS256", expiresIn: decoded.validFor }
      );
    }

    // retornamos status 200 e o token do usuário
    return res.status(200).json({ token });
  } catch (err) {
    if (err && error.name == "TokenExpiredError") {
      return res.status(401).json({ error: "Token de acesso expirado" });
    }
    if (err && err.name == "JsonWebTokenError") {
      if (err.message == "invalid token") {
        return res.status(400).json({ error: "Token inválido" });
      }

      if (err.message == "jwt malformed") {
        return res.status(400).json({ error: "Token mal formatado" });
      }

      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao verificar token" });
    }
  }
}
