const User = require('../models/user');
const bcrypt = require('bcrypt'); // package de hashage de mot de passe, une BD doit absolument avoir des profils users cryptés, les # sont comparés lorsque le user envoie son mdp
const jwt = require('jsonwebtoken');
const { path } = require('../app');
const ObjectID = require('mongoose').Types.ObjectId; // permet d'accéder à tous les objectId de la BD , notamment de la collection users
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
              } /*vérifie l'id de l'utilisateur*/,
              process.env
                .SECRET_TOKEN /* chaîne de caractère qui permet l'encodage*/,
              { expiresIn: '24h' } /* le token expire au bout de 24h */
            );
            res.cookie('jwt', token);
            res.status(200).json({ user });
          });
        })

        // res.status(201).json({ message: 'User created !', user }) ) /* code 201 = création de ressource réussie */

        .catch((err) => res.status(400).json(err));
      /* code 400 erreur lors de la requête : syntaxe invalide*/
    })
    .catch(() => res.status(500).json('Password error'));
};

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
              .json({ passwordError: ' Mot de passe incorrect' });
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
          res.status(200).json({ token });
        })
        .catch(() => res.status(500).json('erreur'));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.logout = (req, res) => {
  console.log(req.auth);
  res.clearCookie('jwt');
};
exports.userProfil = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  if (req.params.id === req.auth.userId || req.auth.isAdmin) {
    User.findById(req.params.id, (err, docs) => {
      if (!err) res.send({ message: "user's profil access granted ", docs });
      else console.log('ID unknown :' + err);
    }).select('  -password -email'); // permet de sélectionner ce qu'on souhaite trouver dans le profil User ou ce qu'on ne souhaite pas voir (-)
  } else {
    res.clearCookie('jwt', '', { maxAge: 1 });
    res.status(401).json('Unauthorized request');
  }
};

exports.updateUser = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  if (req.params.id === req.auth.userId || req.auth.isAdmin) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          email: req.body.email,
          pseudo: req.body.pseudo,
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: 'erreur' });
      }
    );
  } else {
    res.clearCookie('jwt', '', { maxAge: 1 });
    res.status(401).json('Unauthorized request');
  }
};

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

          //console.log(req.body.password),
          { new: true, upsert: true, setDefaultOnInsert: true },

          (err, docs) => {
            if (!err) return res.send({ docs, message: ' Password changed' });
            if (err) return res.status(500).send({ message: 'erreur' });
          }
        );
      });
    });
  } else {
    res.clearCookie('jwt', '', { maxAge: 1 });
    res.status(401).json('Unauthorized request');
  }
};

exports.deleteUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  User.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Successfully deleted' }))

    .catch((error) =>
      res.status(400).json({ error: 'unsuccessfully deleted' })
    );
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.json('cookie enlevé');
};
