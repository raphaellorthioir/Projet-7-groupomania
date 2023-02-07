const mongoose = require('mongoose');

// Post schema
const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    profilPicture: { type: String },
    title: { type: String, required: true, maxlength: 50 },
    pseudo: { type: String },
    text: { type: String, maxlength: 250 },
    date: { type: Date },
    imageUrl: { type: String },
    video: { type: String },
    usersLiked: { type: Array, required: true, default: [] },
    usersDisliked: { type: Array, required: true, default: [] },
    comments: [
      {
        userId: String,
        pseudo: String,
        profilPicture: String,
        text: String,
        timestamp:Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
