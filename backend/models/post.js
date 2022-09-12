const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  textPost: { type: String },
  date:{type:Number},
  imageUrl: { type: String },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: Array, required: true, default: [] },
  usersDisliked: { type: Array, required: true, default: [] },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model('Post', postSchema);
