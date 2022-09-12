const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*création d'un objet qui servira de base pour la création de users, un id est attribué par mongoose lors de la création d'un nouveau User */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(
  uniqueValidator
); /*plugin qui permet à  mongoose de vérifier si l'email existe déjà ou non */
/* exportation du modèle */
/*mongoose.model('nom du model', modèle créé) */
module.exports = mongoose.model('User', userSchema);
