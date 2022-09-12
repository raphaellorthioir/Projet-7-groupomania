const Post = require('../models/post');
const { path, request } = require('../app');
const fs = require('fs');
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    date: Date.now(),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post créé' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updatePost = (req, res, next) => {
  if (req.body.userId !== req.auth.userId || req.body.isAdmin !== false) {
    res.status(400).json({
      error: new Error('unauthorized request !'),
    });
  }

  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
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
    .then((posts) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (!post) {
      res.status(404).json({
        error: new Error('No such Thing!'),
      });
    }
    if (post.userId !== req.auth.userId && req.body.isAdmin === false) {
      res.status(400).json({
        error: new Error('Unauthorized request!'),
      });
    }
    const pathImg = sauce.imageUrl.slice(29);

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
