var passwordValidator = require('password-validator');

// Create a schema
var passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8, 'Le mot de passe doit être composé de 8 caractères au minimum') // Minimum length 8
  .is()
  .max(30) // Maximum length 30
  .has()
  .uppercase(1, 'Une majuscule obligatoire') // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2, 'Doit contenir au moins deux chiffres') // Must have at least 2 digits
  .has()
  .not()
  .spaces(); // Should not have spaces

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res
      .status(400)
      .json(passwordSchema.validate(req.body.password, { details: true }));
  }
};
