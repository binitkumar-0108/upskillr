const express = require('express');
const router = express.Router();
const {
  getVideoById,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');

router.get('/:id', getVideoById);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

module.exports = router;
