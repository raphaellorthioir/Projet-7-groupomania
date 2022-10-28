const User = require('../models/user');
const bcrypt = require('bcrypt'); // package de hashage de mot de passe, une BD doit absolument avoir des profils users cryptés, les # sont comparés lorsque le user envoie son mdp
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
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
        .then(() =>
          res.status(201).json({ message: 'User created !', user })
        ) /* code 201 = création de ressource réussie */
        .catch((error) =>
          res.status(400).json({ message: 'email already exists', error })
        );
      /* code 400 erreur lors de la requête : syntaxe invalide*/
    })
    .catch((error) => res.status(500).json({ error }));
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
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
              } /*vérifie l'id de l'utilisateur*/,
              'RANDOM_TOKEN_SECRET' /* chaîne de caractère qui permet l'encodage*/,
              { expiresIn: '24h' } /* le token expire au bout de 24h */
            ),
            message: 'Connexion réussie',
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.userInfo = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  User.findById(req.params.id, (err, docs) => {
    if (!err) res.send({ message: "user's profil access granted ", docs });
    else console.log('ID unknown :' + err);
  }).select(' -_id -password -email'); // permet de sélectionner ce qu'on souhaite trouver dans le profil User ou ce qu'on ne souhaite pas voir (-)
};

exports.updateUser = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);
  if (req.auth.userId === req.params.id) {
    console.log(req.auth, req.params);
    try {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            email: req.body.email,
            pseudo: req.body.pseudo,
            bio: req.body.bio,
          },
        },

        //console.log(req.body.password),
        { new: true, upsert: true, setDefaultOnInsert: true },
        (err, docs) => {
          if (!err) return res.send(docs);
          if (err) return res.status(500).send({ message: 'erreur' });
        }
      );
    } catch (err) {
      return res.status(500).json({ message: 'erreur' });
    }
  }
};
exports.updatePassword = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  try {
    User.findById(req.params.id, (err, user) => {
      if (req.auth.userId === req.params.id) {
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
      }
    });
  } catch {
    return res
      .status(500)
      .json({ message: 'le changement ne peut pas se lancer' });
  }
};

exports.deleteUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);
  if (req.auth.userId === req.params.id || req.auth.isAdmin === true) {
    User.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Successfully deleted' }))

      .catch((error) =>
        res.status(400).json({ error: 'unsuccessfully deleted' })
      );
  }
};

// follow  and unfollow system
exports.follow = (req, res) => {
  if (!ObjectID.isValid(req.params.id, req.auth.userId))
    return res.status(400).send('ID unknown :' + req.params.id);

  try {
    // add to following list
    User.findByIdAndUpdate(
      req.auth.userId,
      { $addToSet: { following: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // add to the follower list
    User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { followers: req.auth.userId } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.send(docs);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.unfollow = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  try {
    User.findByIdAndUpdate(
      req.auth.userId,
      { $pull: { following: req.params.id } },
      { new: true, upsert: true },

      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    User.findByIdAndUpdate(
      req.params.id,
      { $pull: { followers: req.auth.userId } },
      { new: true, upsert: true },
      (err, docs) => {
        //if (!err) res.status(201).json(docs);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
