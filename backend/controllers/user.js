const User = require('../models/user');
const bcrypt = require('bcrypt'); // package de hashage de mot de passe, une BD doit absolument avoir des profils users cryptés, les # sont comparés lorsque le user envoie son mdp
const jwt = require('jsonwebtoken');
const ObjectID = require('mongoose').Types.ObjectId; // permet d'accéder à tous les objectId de la BD , notamment de la collection users
exports.signup = (req, res, next) => {
  console.log('création en cours');
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
          res.status(201).json({ message: 'Utilisateur créé !' })
        ) /* code 201 = création de ressource réussie */
        .catch((error) => res.status(400).json({ error }));
      /* code 400 erreur lors de la requête : syntaxe invalide*/
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) /* objet filter de comparaison */
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          /* nous renvoit un booléen */
          if (!valid) {
            return res.status(401).json({ error: ' Mot de passe incorrect' });
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

exports.userInfo = (req, res) => {
  console.log(req.params);

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  User.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log('ID unknown :' + err);
  }).select('-password'); // permet de sélectionner ce qu'on souhaite trouver dans le profil User ou ce qu'on ne souhaite pas voir
};

exports.updateUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio, 
        },
      },
      { new: true, upsert: true, setDefaultOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
