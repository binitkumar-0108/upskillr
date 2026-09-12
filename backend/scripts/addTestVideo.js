require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');
const { extractYouTubeId, getThumbnailUrl } = require('./utils/youtube');

async function addVideo() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const courseId = '6a9d437f88dc5038810b4266';
  const youtubeUrl = 'https://www.youtube.com/watch?v=rfscVS0vtbw';
  const youtubeId = extractYouTubeId(youtubeUrl);
  
  const video = await Video.create({
    course: courseId,
    title: 'Python in One Shot',
    youtubeId: youtubeId,
    thumbnail: getThumbnailUrl(youtubeId),
    order: 0,
  });
  
  console.log('Test video created:', video._id);
  process.exit(0);
}

addVideo();
