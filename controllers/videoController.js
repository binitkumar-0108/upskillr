const mongoose = require('mongoose');
const Video = require('../models/Video');
const Course = require('../models/Course');
const { extractYouTubeId, getThumbnailUrl } = require('../utils/youtube');

/**
 * 1. getVideosByCourse
 * Returns all videos belonging to a course, sorted by order ascending.
 */
const getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const videos = await Video.find({ course: courseId }).sort({ order: 1 });
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 2. addVideo
 * Validates course existence and YouTube URL, generates thumbnail, and creates a video.
 */
const addVideo = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, youtubeUrl, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({ message: 'Invalid YouTube URL' });
    }

    const thumbnail = getThumbnailUrl(youtubeId);

    const video = new Video({
      course: courseId,
      title,
      youtubeId,
      thumbnail,
      description,
    });

    await video.save();
    return res.status(201).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 3. getVideoById
 * Returns a single video document by ID.
 */
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 4. updateVideo
 * Updates only allowed fields (title, description, order) on an existing video.
 */
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const { title, description, order } = req.body;
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (order !== undefined) video.order = order;

    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 5. deleteVideo
 * Deletes a video document by ID.
 */
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    return res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getVideosByCourse,
  addVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
};
