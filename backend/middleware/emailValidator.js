const validator = require('email-validator');

module.exports = (req, res, next) => {
  if (req.body.email) {
    if (validator.validate(req.body.email)) {
    } else {
      return res.status(400).json({
        emailError: 'Email non valide, veuillez respecter le format suivant :',
        exempleEmail: {
          exemple1: 'Dupont@gmail.com',
          exemple2: 'henry.dupont@yahoo.fr',
        },
      });
    }
  }
  next();
};
