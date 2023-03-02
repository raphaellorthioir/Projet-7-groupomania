const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        res.clearCookie('jwt', '', { maxAge: 1 });
        res.status(401).json(err);
        next();
      } else {
        UserModel.findById(decodedToken.userId, (err, user) => {
          if (err) {
            res.status(400).json(err);
          } else {
            req.auth = {
              userId: user.id,
              isAdmin: user.isAdmin,
              pseudo: user.pseudo,
            };
          }
          next();
        });
      }
    });
  } else {
    res.clearCookie('jwt', '', { maxAge: 1 });
    res.status(401).json('unAuthorized request');
  }
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        res.status(400).json(err);
      } else {
        UserModel.findById(decodedToken.userId, (err, user) => {
          if (err) {
            res.status(401).json(err);
          } else {
            res.status(200).json(user);
          }
        });
      }
    });
  } else {
    res.status(401).json('no token');
  }
};
