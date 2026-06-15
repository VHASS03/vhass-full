import mongoose from 'mongoose';
import path from 'path';
import { Courses } from './models/Courses.js';
import { Workshop } from './models/Workshop.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to extract filename from full path
const extractFilename = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already just a filename (no slashes), return as is
  if (!imagePath.includes('/') && !imagePath.includes('\\')) {
    return imagePath;
  }
  
  // Extract filename from path
  return path.basename(imagePath);
};

// Fix course image paths
const fixCourseImagePaths = async () => {
  try {
    const courses = await Courses.find({});
    console.log(`Found ${courses.length} courses to check`);
    
    for (const course of courses) {
      if (course.image) {
        const oldPath = course.image;
        const newPath = extractFilename(oldPath);
        
        if (oldPath !== newPath) {
          console.log(`Fixing course ${course.title}:`);
          console.log(`  Old: ${oldPath}`);
          console.log(`  New: ${newPath}`);
          
          course.image = newPath;
          await course.save();
        }
      }
    }
    
    console.log('Course image paths fixed successfully');
  } catch (error) {
    console.error('Error fixing course image paths:', error);
  }
};

// Fix workshop image paths
const fixWorkshopImagePaths = async () => {
  try {
    const workshops = await Workshop.find({});
    console.log(`Found ${workshops.length} workshops to check`);
    
    for (const workshop of workshops) {
      if (workshop.image) {
        const oldPath = workshop.image;
        const newPath = extractFilename(oldPath);
        
        if (oldPath !== newPath) {
          console.log(`Fixing workshop ${workshop.title}:`);
          console.log(`  Old: ${oldPath}`);
          console.log(`  New: ${newPath}`);
          
          workshop.image = newPath;
          await workshop.save();
        }
      }
    }
    
    console.log('Workshop image paths fixed successfully');
  } catch (error) {
    console.error('Error fixing workshop image paths:', error);
  }
};

// Run the migration
const runMigration = async () => {
  console.log('Starting image path migration...');
  
  await fixCourseImagePaths();
  await fixWorkshopImagePaths();
  
  console.log('Migration completed successfully');
  process.exit(0);
};

runMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
