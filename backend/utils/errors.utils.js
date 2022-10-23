
// fichier permettant de renvoyer les différentes erreurs selon requêtes.

module.exports.uploadErrors = (err) => {
  let errors = { format: '', maxSize: '' };

  if (err.message.includes('invalid file'))
    errors.format = ' Format incompatible';

  if (err.message.includes('max size'))
    errors.maxSize = 'Le fichier dépasse 500ko';
  return errors;
};
