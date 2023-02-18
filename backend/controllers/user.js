const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt'); /*package de hashage de mot de passe, une BD doit absolument avoir des profils users cryptés, 
                                    les # sont comparés lorsque le user envoie son mdp */
const jwt = require('jsonwebtoken');
const { path } = require('../app');
const { reset } = require('nodemon');
const fs = require('fs');
const ObjectID = require('mongoose').Types.ObjectId; // permet d'accéder à tous les objectId de la BD , notamment de la collection users

//  SIGNUP
exports.signup = (req, res, next) => {
  bcrypt
    .hash(
      req.body.password,
      10
    ) /* hashage du mot de passe ; fonction asynchrone */
    .then((hash) => {
      const user = new User({
        /* création d'une nouvelle instance du modèle User */
        pseudo: req.body.pseudo,
        email: req.body.email,
        password: hash,
      });
      user
        .save() /* méthode pour enregistrer la requête dans la BD */
        /* toujours renvoyer un code de succés ou d'erreur pour faciliter le débugage */
        .then(() => {
          User.findOne({ email: req.body.email }).then((user) => {
            token = jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
                pseudo: user.pseudo,
                profilPicture: user.profilPicture,
              } /*vérifie l'id de l'utilisateur*/,
              process.env
                .SECRET_TOKEN /* chaîne de caractère qui permet l'encodage*/,
              { expiresIn: '24h' } /* le token expire au bout de 24h */
            );
            res.cookie('jwt', token, { httpOnly: true });
            res.status(200).json('User account created');
          });
        })

        // res.status(201).json({ message: 'User created !', user }) ) /* code 201 = création de ressource réussie */

        .catch((err) => res.status(400).json(err));
      /* code 400 erreur lors de la requête : syntaxe invalide*/
    })
    .catch((err) => res.status(500).json('Password error', err));
};

//SignIn
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) /* objet filter de comparaison */
    .then((user) => {
      if (!user) {
        return res.status(401).json({ emailError: `email inconnu` });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          /* nous renvoit un booléen */

          if (!valid) {
            return res
              .status(401)
              .json({ passwordError: ' Mot de passe incorrect.' });
          } else {
            token = jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
              } /*vérifie l'id de l'utilisateur*/,
              process.env
                .SECRET_TOKEN /* chaîne de caractère qui permet l'encodage*/,
              { expiresIn: '24h' } /* le token expire au bout de 24h */
            );
          }
          res.cookie('jwt', token, { httpOnly: true });
          res.send('Loging ok');
        })
        .catch((err) => res.status(500).json('Wrong password', err));
    })
    .catch((err) => res.status(500).json('User not found', err));
};

//LOGOUT

exports.logout = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);
  if (req.params.id === req.auth.userId) {
    User.findById(req.params.id, (err, user) => {
      if (!err) {
        res.clearCookie('jwt');
        res.status(200).json('Logout succeeded');
      }
      if (err) res.status(500).json('User not found', err);
    });
  } else {
    res.clearCookie('jwt');
    res.status(401).json('Unauthorized request');
  }
};

//GET USER PROFIL
exports.userProfil = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send('ID unknown  :' + req.params.id);
  }

  User.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send({ message: "user's profil access granted ", docs });
    } else {
      res.clearCookie('jwt');
      res.status(400).json(err);
    }
  }).select('  -password -email -isAdmin'); // permet de sélectionner ce qu'on souhaite trouver dans le profil User ou ce qu'on ne souhaite pas voir (-)
};

//UPDATE USER PROFIL PAGE
exports.updateUser = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  if (req.params.id === req.auth.userId || req.auth.isAdmin) {
    User.findById(req.params.id, (err, docs) => {
      const pathImg = docs.profilPicture.substring(44);
      if (req.file && pathImg !== 'random-user.png') {
        fs.unlink(`./uploads/client/images/${pathImg}`, (err) => {
          if (err) console.log('error delete img profil from local folder');
          else console.log(' img profil deleted from folder');
        });
        User.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              email: req.body.email,
              pseudo: req.body.pseudo,
              bio: req.body.bio,
              profilPicture: `${req.protocol}://${req.get(
                'host'
              )}/uploads/client/images/${req.file.filename}`,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultOnInsert: true,
            runValidators: true,
          },
          (err, docs) => {
            if (!err) {
              Post.updateMany(
                { userId: req.params.id },
                {
                  $set: {
                    profilPicture: `${req.protocol}://${req.get(
                      'host'
                    )}/uploads/client/images/${req.file.filename}`,
                  },
                },
                {
                  new: true,
                  upsert: true,
                  setDefaultOnInsert: true,
                  runValidators: true,
                  timestamps: false,
                },
                (err, posts) => {
                  if (!err)
                    console.log({ message: 'sucéés update many', posts });
                  console.log({ message: 'echec update many', err });
                }
              );
              return res.status(200).json(docs);
            }
            if (err) return res.status(500).send({ message: 'erreur' });
          }
        ).select('-password -email -_id -isAdmin  -__v ');
      } else {
        User.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              email: req.body.email,
              pseudo: req.body.pseudo,
              bio: req.body.bio,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultOnInsert: true,
            runValidators: true,
          },
          (err, docs) => {
            console.log(docs)
            if (!err) {
              Post.updateMany(
                { userId: docs._id },
                {
                  $set: {
                    pseudo: req.body.pseudo,
                  },
                },
                {
                  upsert: true,
                  setDefaultOnInsert: true,
                  runValidators: true,
                  timestamps: false,
                },
                (err, posts) => {
                  if (!err) {
                    console.log(" a fonctionné")
                    console.log({ message: 'sucéés update many', posts });
                  }
                  if (err) console.log({ message: 'echec update many', err });
                }
              );
              return res.status(200).json(docs);
            }
            if (err) return res.status(500).send(err);
          }
        ).select('-password -email  -isAdmin  -updatedAt -__v ');
      }
    });
  } else {
    res.clearCookie('jwt');
    res.status(401).json('Unauthorized request');
  }
};

// UPDATE PASSWORD
exports.updatePassword = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  if (req.params.id === req.auth.userId) {
    User.findById(req.params.id, (err, user) => {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        User.findOneAndUpdate(
          { _id: req.params.id },

          {
            $set: {
              password: hash,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultOnInsert: true,
            runValidators: true,
          },

          (err, docs) => {
            if (!err) return res.send(' Password changed');
            if (err) return res.status(500).send('User not found');
          }
        );
      });
    });
  } else {
    res.clearCookie('jwt');
    res.status(401).json('Unauthorized request');
  }
};

//DELETE USER ACOOUNT
exports.deleteUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);
  if (req.params.id === req.auth.userId || req.auth.isAdmin) {
    User.deleteOne({ _id: req.params.id })
      .then(() =>
        Post.deleteMany({ userId: req.auth.userId }).then(() =>
          res.status(200).json({ message: 'USER Successfully deleted' })
        )
      )

      .catch((error) => {
        res.clearCookie('jwt');
        res.status(500).json('User not found', error);
      });
  } else {
    res.status(401).json('Unauthorized request');
    res.clearCookie('jwt');
  }
};
