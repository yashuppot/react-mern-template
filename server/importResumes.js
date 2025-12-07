const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Resume = require('./models/Resume');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SOURCE_DIR = path.join(__dirname, '../client/resumes_recent');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

async function importResumes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    // Get files from source directory
    const files = fs.readdirSync(SOURCE_DIR);

    let importedCount = 0;

    for (const file of files) {
      if (file.toLowerCase().endsWith('.pdf')) {
        const sourcePath = path.join(SOURCE_DIR, file);
        const destPath = path.join(UPLOAD_DIR, file);

        // Copy file instead of move to preserve original for now, or just move
        // Using copyFileSync to be safe
        fs.copyFileSync(sourcePath, destPath);

        // Check if already exists in DB to avoid duplicates
        const existing = await Resume.findOne({ fileName: file });
        
        if (!existing) {
          await Resume.create({
            user: null, // System/Imported resume
            fileName: file,
            originalName: file,
            rating: 1200,
            wins: 0,
            losses: 0
          });
          importedCount++;
        }
      }
    }

    console.log(`Successfully imported ${importedCount} resumes.`);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Done.');

  } catch (error) {
    console.error('Import error:', error);
    process.exit(1);
  }
}

importResumes();
