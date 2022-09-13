const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  textPost: { type: String },
  date: { type: Date },
  imageUrl: { type: String },
  usersLiked: { type: Array, required: true, default: [] },
  usersDisliked: { type: Array, required: true, default: [] }
});

module.exports = mongoose.model('Post', postSchema);
