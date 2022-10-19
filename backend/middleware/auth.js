const jwt = require('jsonwebtoken');
const ObjectID = require('mongoose').Types.ObjectId;
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
    const isAdmin = decodedToken.isAdmin;
    req.auth = { userId, isAdmin }; // crée un objet d'authentification contenant l'userId; = {userId} dans le cas où le nom du champ est le même que celui de la variable qu'on veut lui mettre
    if (!ObjectID.isValid(req.auth.userId)) {
      return res.status(400).send('ID unknown :' + req.params.id);
    }

    {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'unauthorized request , token is missing' });
  }
};
