const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); /* associe les fonctions au router */
const { checkUser } = require('../middleware/auth');
const passwordValidator = require('../middleware/password-validator');
const emailValidator = require('../middleware/emailValidator');
const uploadController = require(`../controllers/upload.controller`);
const multer = require(`multer`);
const upload = multer();

// authentification

// Signup,login and logout routes
router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/logout', checkUser, userCtrl.logout);

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
router.delete('/deleteUserAccount/:id', checkUser, userCtrl.deleteUser);

// upload new image profil

router.post('/upload', upload.single(`file`), uploadController.uploadProfil);

// follow and unfollow routes

module.exports = router;
