const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');
const { checkUser } = require('../middleware/auth');

router.post('/:id', checkUser, multer, postCtrl.createPost);
router.put('/:postId', checkUser, multer, postCtrl.updatePost);
router.post('/like/:postId', checkUser, postCtrl.likePost);
router.get('/', postCtrl.getAllPosts);
router.delete('/:postId', checkUser, multer, postCtrl.deletePost);

router.patch('/comment-post/:postId', checkUser, postCtrl.commentPost);
router.put('/delete-comment/:postId', checkUser, postCtrl.deleteComment);
module.exports = router;
