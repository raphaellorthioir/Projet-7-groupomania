const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
//const ObjectID = require('mongoose').Types.ObjectId;
/*module.exports = (req, res, next) => {
  try {
    const token =
      req.headers.authorization.split(
        ' '
      )[1];  récupération du token dans le header 
    const decodedToken = jwt.verify(
      token,
      'RANDOM_TOKEN_SECRET'
    );  vérifie si le token correspond au token de la fonction login 
    const userId = decodedToken.userId;  vérifie l'userId encodé 
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
*/

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        console.log('cookie non trouvé');
        res.clearCookie('jwt', '', { maxAge: 1 });
        res.send(' Decode Token error ');
        next();
      } else {
        UserModel.findById(decodedToken.userId, (err, user) => {
          if (err) {
            res.status(400).json({ message: 'User not found' });
          }
          req.auth = { userId: user.id, isAdmin: user.isAdmin };
          next();
        });
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        console.log('erreur requireAuth');
        res.send(200).json('no token');
      } else {
        res
          .status(200)
          .json({ userId: decodedToken.userId, isAdmin: decodedToken.isAdmin });
        next();
      }
    });
  } else {
    console.log('no token');
  }
};
