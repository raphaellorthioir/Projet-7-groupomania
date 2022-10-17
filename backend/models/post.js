const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    textPost: { type: String, maxlength: 500 },
    date: { type: Date },
    imageUrl: { type: String },
    video: { type: String },
    usersLiked: { type: Array, required: true, default: [] },
    usersDisliked: { type: Array, required: true, default: [] },
    comments: {
      type: [
        {
          commenterId: String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
