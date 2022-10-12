const mongoose = require('mongoose');
const { isEmail } = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

/*création d'un objet qui servira de base pour la création de users, un id est attribué par mongoose lors de la création d'un nouveau User */
const userSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      minLength: 3,
      maxLength: 20,
      unique: true,
      trimp: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail], // vérifie que le format d'email est valide , sans caractères spéciaux etc
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: { type: String, required: true },
    profilPicture: {
      type: String,
      default: './uploads/profil/random-user.png',
    },
    bio: {
      type: String,
      max: 1000,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(
  uniqueValidator
); /*plugin qui permet à  mongoose de vérifier si l'email existe déjà ou non */
/* exportation du modèle */
/*mongoose.model('nom du model', modèle créé) */
module.exports = mongoose.model('User', userSchema);
