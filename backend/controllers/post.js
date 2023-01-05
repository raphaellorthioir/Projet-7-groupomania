const { updateOne, findOne, findById } = require('../models/post');
const Post = require('../models/post');
const userModel = require('../models/user');
const { path, request } = require('../app');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { isBuffer } = require('util');
const { post } = require('../routes/user');
const { timeStamp, log } = require('console');
const user = require('../models/user');
exports.createPost = (req, res, next) => {
  const postObject = req.body;
  delete postObject._id;
  const post = new Post({
    ...postObject,
    userId: req.body.posterId,
    usersLiked: [],
    usersDisliked: [],
  });
  if (req.file) {
    post.imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post créé', post }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updatePost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send('ID unknown :' + req.params.postId);
  try {
    const postObject = req.file
      ? {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    Post.findOne({ _id: req.params.postId })
      .then((post) => {
        if (post) {
          return Post.updateOne({ _id: req.params.postId }, postObject);
        }
        return res.status(401).json({ message: 'Bad user' });
      })
      .then(() => {
        res.status(200).json({ message: 'post updated' });
      })
      .catch(() => {
        res.status(400).json({ message: 'post not found' });
      });
  } catch {
    return res.status(400).send({ message: 'erreur' });
  }
};

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send('ID unknown :' + req.params.postId);

  Post.findOne({ _id: req.params.postId }).then((post) => {
    if (!post) {
      res.status(404).json({
        error: 'post doesnt exist',
      });
    }
    Post.deleteOne({ _id: req.params.postId })
      .then(() => res.status(200).json({ message: 'Successfully deleted' }))

      .catch((error) =>
        res.status(400).json({ error: 'unsuccessfully deleted' })
      );
  });
};

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.postId }).then((post) => {
    if (req.body.like == 1) {
      if (!post.usersLiked.includes(req.body.userId)) {
        post.usersLiked.push(req.body.userId);
        post.usersDisliked.splice(
          post.usersDisliked.indexOf(req.body.userId),
          1
        );
      } else {
        post.usersLiked.splice(post.usersLiked.indexOf(req.body.userId), 1);
      }

      Post.updateOne({ _id: req.params.postId }, post)
        .then(() => {
          if (!post.usersLiked.includes(req.body.userId)) {
            return res.status(200).json({
              message: 'Post like removed ',
              usersLiked: post.usersLiked,
              usersDislikes: post.usersDisliked,
            });
          } else {
            return res.status(200).json({
              message: 'Post liked ',
              usersLiked: post.usersLiked,
              usersDislikes: post.usersDisliked,
            });
          }
        })
        .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == -1) {
      if (!post.usersDisliked.includes(req.body.userId)) {
        post.usersDisliked.push(req.body.userId);
        post.usersLiked.splice(post.usersLiked.indexOf(req.body.userId), 1);
      } else {
        post.usersDisliked.splice(
          post.usersDisliked.indexOf(req.body.userId),
          1
        );
      }
      Post.updateOne({ _id: req.params.postId }, post)
        .then(() => {
          if (post.usersDisliked.includes(req.body.userId)) {
            return res.status(200).json({
              message: 'undislike !',
              usersLiked: post.usersLiked,
              usersDislikes: post.usersDisliked,
            });
          } else {
            return res.status(200).json({
              message: 'undislike removed !',
              usersLiked: post.usersLiked,
              usersDislikes: post.usersDisliked,
            });
          }
        })
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

// Comments
exports.commentPost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send(`This post doesn't exist anymore`);

  userModel.findById(req.body.userId, (err, user) => {
    Post.findByIdAndUpdate(req.params.postId, {
      $push: {
        comments: {
          userId: req.body.userId,
          text: req.body.text,
          userPseudo: user.pseudo,

          timestamp: new Date().getTime(),
        },
      },
    })
      .then(() => {
        res.status(200).json({ message: 'commentaire créé' });
      })
      .catch(() => {
        res.status(400).json({ message: `Problems to send comment !` });
      });
  });
};

exports.editComment = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send({ message: `This Post doesn't exist` });

  console.log(req.params.postId);
  try {
    return Post.findById(req.params.postId, (err, docs) => {
      const theComment = docs.comments.find((comment) => {
        return comment._id.equals(req.body.commentId);
      });
      console.log(theComment);
      if (!theComment) return res.status(404).send(err);
      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs.comments);
        return res.status(400).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};
exports.deleteComment = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send({ message: `Post doesn't exist` });
  try {
    Post.findById(
      req.params.postId,

      (err, docs) => {
        const theComment = docs.comments.find((comment) => {
          return comment._id.equals(req.body.commentId);
        });

        if (!theComment) return res.status(404).send('comment not found');
        docs.comments.splice(docs.comments.indexOf(theComment), 1);

        docs.save((err) => {
          if (!err) return res.status(200).send({ message: 'comment deleted' });
          return res.status(400).send(err);
        });
      }
    );
  } catch (err) {
    return res.status(400).send(error);
  }
};
