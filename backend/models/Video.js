const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeId: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
