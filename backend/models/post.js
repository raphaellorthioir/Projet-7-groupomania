const mongoose = require('mongoose');

// Post schema
const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    textPost: { type: String, maxlength: 500 },
    date: { type: Date },
    imageUrl: { type: String },
    video: { type: String },
    usersLiked: { type: Array, required: true, default: [] },
    usersDisliked: { type: Array, required: true, default: [] },
    comments: [
      {
        userId: String,
        userPseudo: String,
        userImgProfil: String,
        text: String,
        timestamp: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
