const { updateOne, findOne, findById } = require('../models/post');
const Post = require('../models/post');
const userModel = require('../models/user');
const { path, request } = require('../app');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { isBuffer } = require('util');
const { post } = require('../routes/user');
const { timeStamp } = require('console');
const user = require('../models/user');
exports.createPost = (req, res, next) => {
  const postObject = req.body;
  delete postObject._id;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
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
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  if (req.body.userId !== req.auth.userId) {
    return res.status(400).json({
      error: 'unauthorized request !',
    });
  }

  const postObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  Post.findOne({ _id: req.params.id }).then((post) => {
    if (!post) {
      res.status(404).json({
        error: 'doesnt exist',
      });
    }
    if (post.userdId === req.auth.userId || req.auth.isAdmin === true) {
      Post.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Successfully deleted' }))

        .catch((error) =>
          res.status(400).json({ error: 'unsuccessfully deleted' })
        );
      console.log(post);
      console.log(req.auth);
      console.log(req.auth.isAdmin);
    } else {
      res.status(400).json({
        error: 'Unauthorized request!',
      });
      console.log(post);
      console.log(req.auth);
      console.log(req.auth.isAdmin);
    }
  });
};

/*if (docs.imageUrl) {
  const pathImg = docs.imageUrl.slice(29);

  fs.unlink(`./images/${pathImg}`, (err) => {
    //file removed
    if (err) {
      console.log('erreur');
    }
  });
}*/

/* Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post supprimé' }))
    .catch((error) => res.status(400).json({ error }));*/

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.like == 1) {
      if (!post.usersLiked.includes(req.auth.userId)) {
        post.usersLiked.push(req.auth.userId);
        post.usersDisliked.splice(
          post.usersDisliked.indexOf(req.auth.userId),
          1
        );
      } else {
        post.usersLiked.splice(post.usersLiked.indexOf(req.auth.userId), 1);
      }

      Post.updateOne({ _id: req.params.id }, post)
        .then(() => {
          if (!post.usersLiked.includes(req.auth.userId)) {
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

    /*
    if (req.body.like == 0) {
      if (post.usersDisliked.includes(req.auth.userId)) {
        post.usersDisliked.splice(
          post.usersDisliked.indexOf(req.auth.userId),
          1
        );
      }
      if (post.usersLiked.includes(req.auth.userId)) {
        post.usersLiked.splice(post.usersLiked.indexOf(req.auth.userId), 1);
      }
      Post.updateOne({ _id: req.params.id }, post)
        .then(() => res.status(200).json({ message: 'Post neutre!' }))
        .catch((error) => res.status(400).json({ error }));
    }*/

    if (req.body.like == -1) {
      if (!post.usersDisliked.includes(req.auth.userId)) {
        post.usersDisliked.push(req.auth.userId);
        post.usersLiked.splice(post.usersLiked.indexOf(req.auth.userId), 1);
      } else {
        post.usersDisliked.splice(
          post.usersDisliked.indexOf(req.auth.userId),
          1
        );
      }
      Post.updateOne({ _id: req.params.id }, post)
        .then(() => {
          if (post.usersDisliked.includes(req.auth.userId)) {
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
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' + req.params.id);

  userModel.findById(req.auth.userId, (err, user) => {
    Post.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          userId: req.auth.userId,
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
        res.status(400).json({ message: 'erreur' });
      });
  });
};

exports.editComment = (req, res, next) => {
  if (!ObjectID.isValid(req.params.postId))
    return res.status(400).send({ message: `This Post doesn't exist` });

  console.log(req.params.postId);
  try {
    Post.findById(req.params.postId, (err, docs) => {
      const theComment = docs.comments.find((comment) => {
        if (req.auth.userId === comment.userId) {
          return comment._id.equals(req.params.commentId);
        }
        res.status(401).json({ message: 'non authorized User', err });
      });

      if (!theComment) return res.status(404).send('comment not found');
      theComment.text = req.body.text;

      docs.save((err) => {
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
      /*  {
        $pull: {
          comments: { _id: req.body.commentId, userId: req.auth.userId },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send({ message: 'comment deleted' });
        else return res.status(400).send(err);
      },*/
      (err, docs) => {
        /* if (
            user.isAdmin === true ||
            docs.comments.includes(`${req.auth.userId}`)
          ) {
            docs.comments.splice(
              docs.comments.indexOf(`${req.body.commentId}`),
              1
            );
          } else {
            res.status(401).send({ message: ' non autorisé', err });
          }*/
        const theComment = docs.comments.find((comment) => {
          if (req.auth.userId === comment.userId || req.auth.isAdmin) {
            return comment._id.equals(req.params.commentId);
          }
          res.status(401).json({ message: 'non authorized User', err });
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
