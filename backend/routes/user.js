const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); /* associe les fonctions au router */
const auth = require('../middleware/auth');
const passwordValidator = require('../middleware/password-validator');
const emailValidator = require('../middleware/emailValidator');
const uploadController = require(`../controllers/upload.controller`);
const multer = require(`multer`);
const upload = multer();

// Signup and login routes
router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

// Get user object + update User object + update password
router.get('/:id', auth, userCtrl.userInfo);
router.put('/updateUserProfil/:id', auth, emailValidator, userCtrl.updateUser);
router.put(
  '/changePassword/:id',
  auth,
  passwordValidator,
  userCtrl.updatePassword
);
router.delete('/deleteUserAccount/:id', auth, userCtrl.deleteUser);

// upload new image profil

router.post(
  '/upload',
  upload.single(`file`),
  auth,
  uploadController.uploadProfil
);

// follow and unfollow routes

router.patch('/follow/:id', auth, userCtrl.follow);
router.patch('/unfollow/:id', auth, userCtrl.unfollow);

module.exports = router;
