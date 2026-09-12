const mongoose = require('mongoose');
const Course = require('../models/Course');
const Video = require('../models/Video');

/**
 * 1. getAllCourses
 * Returns all published courses sorted by createdAt descending.
 */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 2. getCourseById
 * Returns a single course by its ID.
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * 3. createCourse
 * Creates a new Course with isPublished set to true by default.
 */
const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required', message: 'Title is required' });
    }

    const course = new Course({
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category ? category.trim() : '',
      isPublished: true,
    });

    await course.save();
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error', message: error.message || 'Server error' });
  }
};

/**
 * 4. deleteCourse
 * Deletes a course by ID and cascades deletion to all associated videos.
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Cascade delete all videos belonging to this course
    const deleteResult = await Video.deleteMany({ course: id });
    const deletedCount = deleteResult.deletedCount || 0;

    // Delete the course itself
    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Course and ${deletedCount} associated videos deleted`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
};
