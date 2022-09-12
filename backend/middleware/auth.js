const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token =
      req.headers.authorization.split(
        ' '
      )[1]; /* récupération du token dans le header */
    const decodedToken = jwt.verify(
      token,
      'RANDOM_TOKEN_SECRET'
    ); /* vérifie si le token correspond au token de la fonction login */
    const userId = decodedToken.userId; /* vérifie l'userId encodé */
    req.auth = { userId }; // crée un objet d'authentification contenat l'userId; = {userId} dans le cas où le nom du champ est le même que celui de la variable qu'on veut lui mettre
    if (req.body.userId && req.body.userId !== userId) {
      throw 'invalid user ID';
    } else if (
      (req.body.userId && req.body.userId == userId) ||
      req.body.isAdmin === true
    ) {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error(' unauthorized request') });
  }
};
