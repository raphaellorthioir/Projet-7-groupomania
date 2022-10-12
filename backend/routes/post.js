const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.post('/:id/like', auth, postCtrl.likePost);
router.get('/', auth, postCtrl.getAllPosts);
router.delete('/:id', auth, multer, postCtrl.deletePost);

module.exports = router;
