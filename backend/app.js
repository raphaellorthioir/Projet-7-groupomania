const express = require('express'); // import du package express
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); // facilite les interactions entre express et mongoDB, permet la création de schémas de données
const path = require('path'); // donne accés aux chemins du système de fichier local
const app = express(); // création de l'application express qui sera lu par le serveur node
module.exports = app; // export de la constante pour y accéder depuis les autres fichiers du serveur node
const helmet = require('helmet');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
//const authController = require("./middleware/auth")
const { checkUser, requireAuth } = require('./middleware/auth');
require('dotenv').config(); // permet de cacher des variables

// Mongodb connection
mongoose
  .connect(process.env.MY_MONGO_DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongDB !'))
  .catch(() => console.log('Failed to connect to MongoDB !'));

app.use(express.json()); //intercèpte les requêtes qui ont un content type json  et nous met à disposition le corps de la requête dans req.body

// obligatoire pour éviter les problèmes de CORS et permettre à l'application d'accéder au serveur , il faut préciser les autorisations
app.use((req, res, next) => {
  // permet d'attribuer un middleware à une route, ici toutes les routes
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.API_URL
  ); /* donne l'accés à partir d'un nom de domaine détermine la route d'origine sur laquelle les requêtes seront autorisées.
   Lors de l'utilisation de credntials (identifiants par cookie ou en-tête d'autorisation , il est obligatoire de préciser la route , l'utilisation de * avec credentials entraîne une erreur du serveur  */
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); // ajouter les heades aux requêtes
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); // authorise les méthodes
  res.setHeader('Access-Control-Allow-Credentials', true); // indique aux navigateur s'il faut exposer la réponse au code js frontend lors d'une demande d'authentification
  next();
});

// routes générales
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/jwt', requireAuth);

app.use('/images', express.static(path.join(__dirname, 'images'))); //  requêtes vers le dossier local  '/images' , on utilise static pour servir le dossier image, on définit la route avec path.join en indiquant le nom du dossier
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
