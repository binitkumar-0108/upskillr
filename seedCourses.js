require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const BASE_URL = 'http://localhost:5000/api';

const courseData = [
  {
    title: 'Java Basics',
    description: 'Learn Java from scratch',
    category: 'Java',
    videos: [
      { title: 'Java Basics - Full Course (freeCodeCamp)', youtubeUrl: 'PASTE_YOUTUBE_URL_HERE' },
      { title: 'Java Full Course for Beginners (Mosh)', youtubeUrl: 'PASTE_YOUTUBE_URL_HERE' },
      { title: 'Java in One Shot (Bro Code)', youtubeUrl: 'PASTE_YOUTUBE_URL_HERE' },
      { title: 'Java Roadmap', youtubeUrl: 'PASTE_YOUTUBE_URL_HERE' },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB. Seeding courses...\n');

  for (const courseInfo of courseData) {
    const course = await Course.create({
      title: courseInfo.title,
      description: courseInfo.description,
      category: courseInfo.category,
      isPublished: true,
    });

    console.log(`Course created: "${course.title}" (${course._id})`);

    for (let i = 0; i < courseInfo.videos.length; i++) {
      const video = courseInfo.videos[i];

      const res = await fetch(`${BASE_URL}/courses/${course._id}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: video.title, youtubeUrl: video.youtubeUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`  ✔ Video added: "${video.title}" (order: ${i})`);
      } else {
        console.log(`  ✘ Failed: "${video.title}" — ${data.error || 'unknown error'}`);
      }
    }
    console.log('');
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed();
