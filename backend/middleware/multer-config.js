const multer = require('multer'); /* importation de multer, facilite la gestion de fichiers envoyés par des requêtes http par l'API*/

/* construction d'une bibiothèque*/
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
/* création d'un objet de configuration pour multer */
const storage = multer.diskStorage({
  // enregistrement sur le disque
  destination: (req, file, callback) => {
    // objet de config a besoin de 2 éléments : la destination, fct° qui va indiquer à multer où enregistrer les fichiers

    callback(null, 'uploads/client/images');
  },
  filename: (req, file, callback) => {
    // filename , fonction qui va indiquer à multer quel nom de fichier il devra utiliser
    const name = file.originalname.split(' ').join('_').split('.')[0]; // génère le nouveau nom pour le fichier avec le nom d'origine du fichier, on remplace les potentiels espaces dans les noms de fichiers pour les remplacer par des '_'

    const extension = MIME_TYPES[file.mimetype];
    callback(
      null,
      name + Date.now() + '.' + extension
    ); /* création du fichier avec son nouveau nom , un timestap pour y indiquer la date d'entrée et l'extension du fichier */
  },
});

module.exports = multer({ storage }).single(
  'image'
); /* export du middleware , de l'objet storage et appel de la méthode single() pour indiquer qu'il s'agit d'un fichier unique et d'images uniquement */
