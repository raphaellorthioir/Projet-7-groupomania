const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); /* associe les fonctions au router */
const { checkUser } = require('../middleware/auth');
const passwordValidator = require('../middleware/password-validator');
const emailValidator = require('../middleware/emailValidator');
const multer = require('../middleware/multer-config');

// authentification

// Signup,login and logout routes
router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/logout/:id', checkUser, userCtrl.logout);

// Get user object + update User object + update password
router.get('/:id', checkUser, userCtrl.userProfil);
router.put(
  '/updateUserProfil/:id',
  checkUser,
  emailValidator,
  userCtrl.updateUser
);
router.put(
  '/changePassword/:id',
  checkUser,
  passwordValidator,
  userCtrl.updatePassword
);

// upload image profil

router.put('/uploadImgProfil/:id', checkUser, multer, userCtrl.updateUser);

// Delete user
router.delete('/deleteUser/:id', checkUser, userCtrl.deleteUser);

module.exports = router;
