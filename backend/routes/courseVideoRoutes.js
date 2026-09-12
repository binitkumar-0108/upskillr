const express = require('express');
const router = express.Router({ mergeParams: true });
const { getVideosByCourse, addVideo } = require('../controllers/videoController');

router.get('/:courseId/videos', getVideosByCourse);
router.post('/:courseId/videos', addVideo);

module.exports = router;
