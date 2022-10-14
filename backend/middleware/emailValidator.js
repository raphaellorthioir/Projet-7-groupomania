const validator = require('email-validator');

module.exports = (req, res, next) => {
  if (req.body.email) {
    if (validator.validate(req.body.email)) {
    } else {
      return res.status(400).json({ error: 'email address not valid' });
    }
  }
  next();
};
