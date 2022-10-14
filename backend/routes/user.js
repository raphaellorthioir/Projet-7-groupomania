const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user'); /* associe les fonctions au router */
const auth = require('../middleware/auth');
const passwordValidator = require('../middleware/password-validator');
const emailValidator = require('../middleware/emailValidator');

router.post('/signup', emailValidator, passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/:id', auth, userCtrl.userInfo);
router.put('/updateUserInfo/:id', auth, emailValidator, userCtrl.updateUser);
router.put(
  '/changePassword/:id',
  auth,
  passwordValidator,
  userCtrl.updatePassword
);
router.delete('/:id', auth, userCtrl.deleteUser);
router.patch('/follow/:id', userCtrl.follow);
router.patch('/unfollow/:id', userCtrl.unfollow);

module.exports = router;
