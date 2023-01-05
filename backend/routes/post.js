const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');

//Posts routes
router.post('/', multer, postCtrl.createPost);
router.put('/:postId', multer, postCtrl.updatePost);
router.post('/:postId/like', postCtrl.likePost);
router.get('/', postCtrl.getAllPosts);
router.delete('/:postId', multer, postCtrl.deletePost);

// comments routes

router.patch('/comment-post/:postId', postCtrl.commentPost);
router.patch('/edit-comment/:postId/:commentId', postCtrl.editComment);
router.patch('/delete-comment/:postId/:commentId', postCtrl.deleteComment);
module.exports = router;
