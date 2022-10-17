const { updateOne, findOne } = require('../models/post');
const Post = require('../models/post');
const userModel = require('../models/user');
const { path, request } = require('../app');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
exports.createPost = (req, res, next) => {
  const postObject = req.body;
  delete postObject._id;
  const post = new Post({
    ...postObject,
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
    .then(() => res.status(201).json({ message: 'Post créé' }))
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
        error: new Error('No such Thing!'),
      });
    }
    if (post.userId !== req.auth.userId && !req.auth.isAdmin) {
      res.status(400).json({
        error: new Error('Unauthorized request!'),
      });
    }
    const pathImg = post.imageUrl.slice(29);

    fs.unlink(`./images/${pathImg}`, (err) => {
      //file removed
      if (err) {
        console.log('erreur');
      }
    });
  });
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post supprimé' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.like == 1) {
      if (!post.usersLiked.includes(req.body.userId)) {
        post.usersLiked.push(req.body.userId);
      }

      Sauce.updateOne({ _id: req.params.id }, post)
        .then(() => res.status(200).json({ message: 'Post likée!' }))
        .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == 0) {
      if (post.usersDisliked.includes(req.body.userId)) {
        post.usersDisliked.splice(
          sauce.usersDisliked.indexOf(req.body.userId),
          1
        );
      }
      if (post.usersLiked.includes(req.body.userId)) {
        post.usersLiked.splice(post.usersLiked.indexOf(req.body.userId), 1);
      }
      Post.updateOne({ _id: req.params.id }, post)
        .then(() => res.status(200).json({ message: 'Post neutre!' }))
        .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == -1) {
      if (!post.usersDisliked.includes(req.body.userId)) {
        post.usersDisliked.push(req.body.userId);
      }
      Post.updateOne({ _id: req.params.id }, post)
        .then(() => res.status(200).json({ message: 'Post dislikée!' }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};
