const express = require('express'); // import du package express
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // facilite les interactions entre express et mongoDB, permet la création de schémas de données
const path = require('path'); // donne accés aux chemins du système de fichier
const app = express(); // création de l'application express qui sera lu par le serveur node
module.exports = app; // export de la constante pour y accéder depuis les autres fichiers du serveur node
const helmet = require('helmet');
/*const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');*/
require('dotenv').config(); // permet de cacher des variables

mongoose
  .connect(process.env.MY_MONGO_DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); //intercèpte les requêtes qui ont un content type json  et nous met à disposition le corps de la requête dans req.body

// obligatoire pour éviter les problèmes de CORS et permettre à l'application d'accéder au serveur , il faut préciser les autorisations
app.use((req, res, next) => {
  // permet d'attribuer un middleware à une route, ici toutes les routes
  res.setHeader('Access-Control-Allow-Origin', '*'); // * donne l'accés à tout le monde
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); // ajouter les heades aux requêtes
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); // authorise les méthodes
  next();
});

app.use(bodyParser.json());

//app.use(helmet()) // action par défaut pour la sécurité

/* app.use('/images',express.static(path.join(__dirname, 'images')))//  requêtes vers le dossier local  '/images' , on utilise static pour servir le dossier image, on définit la route avec path.join en indiquant le nom du dossier
  app.use('/api/auth',userRoutes);
  app.use('/api/sauces',saucesRoutes);
 */
