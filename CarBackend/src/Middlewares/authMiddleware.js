const { User } = require("../models");

async function injectUser(req, res, next) {
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

    // buscamos o usuário cujo id está no token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    // injetamos o usuário na requisição para que possa ser usado durante o fluxo
    req.user = user;

    // processeguimos a requisição
    return next();
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
