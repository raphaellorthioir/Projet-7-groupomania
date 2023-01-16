const validator = require('email-validator');

module.exports = (req, res, next) => {
  if (req.body.email) {
    if (validator.validate(req.body.email)) {
    } else {
      return res.status(400).json({
        emailError: 'Email non valide,veuillez respecter le format suivant',
        exampleEmail: {
          exemple1: 'henry-dupont@gmail.com',
          example2: 'henry.dupont@yahoo.fr',
        },
      });
    }
  }
  next();
};
