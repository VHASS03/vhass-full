import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
// import { Workshop } from "../models/Workshop.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import path from "path";
import { Workshop } from "../models/Workshop.js";
import { Transaction } from "../models/Transaction.js";
import { sendContactMail, sendContactAck } from "../middlewares/sendMail.js";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);

// Helper function to safely delete file
const safeDeleteFile = async (filePath) => {
  try {
    const exists = await existsAsync(filePath);
    if (exists) {
      await unlinkAsync(filePath);
      console.log("File deleted:", filePath);
    } else {
      console.log("File does not exist:", filePath);
    }
  } catch (error) {
    console.log("Error handling file:", filePath, error.message);
  }
};

export const createCourse = async (req, res, next) => {
  console.log('Creating course - Full Request body:', req.body);
  console.log('Creating course - Request file:', req.file);
  console.log('Creating course - Request files:', req.files);

  // Validate required fields
  // Accept alternate field names from frontend
  const title = req.body.title;
  const description = req.body.description || req.body.about;
  const createdBy = req.body.createdBy || req.body.instructor;
  const category = req.body.category || 'General';
  // Normalize price and duration
  const normalizeNumber = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') return value;
    // Strip currency symbols and non-digits
    const cleaned = String(value).replace(/[^0-9.]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : undefined;
  };
  const duration = normalizeNumber(req.body.duration);
  const price = normalizeNumber(req.body.price);

  // Early validation with explicit feedback
  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!description) missingFields.push('description/about');
  if (!createdBy) missingFields.push('createdBy/instructor');
  // Coerce numbers; if invalid, default to 0 instead of blocking
  const durationNumber = Number.isFinite(duration) ? duration : 0;
  const priceNumber = Number.isFinite(price) ? price : 0;
  if (!category) missingFields.push('category');
  if (missingFields.length) {
    console.log('Create course missing fields:', missingFields, {
      title,
      hasDescription: !!description,
      createdBy,
      duration: durationNumber,
      price: priceNumber,
      category
    });
    // Only hard-require title and description; fill the rest with defaults
    if (missingFields.includes('title') || missingFields.includes('description/about') || missingFields.includes('createdBy/instructor')) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }
  }
  
  // Only require essential fields, provide defaults for others
  if (!title || !description || !createdBy) {
    return res.status(400).json({
      message: "Missing required fields",
      requiredFields: ["title", "description", "createdBy"]
    });
  }

  // Handle file upload
  const image = req.file || req.files?.file;
  let imagePath = null;
  
  console.log('=== IMAGE HANDLING DEBUG ===');
  console.log('req.file:', req.file);
  console.log('req.files:', req.files);
  console.log('req.body.image:', req.body.image);
  
  if (image) {
    // Store only the filename, not the full path
    imagePath = image.filename || path.basename(image.path);
    console.log('Image uploaded, stored path:', imagePath);
  } else if (req.body.image) {
    // If it's a direct URL, keep it as is
    imagePath = req.body.image;
    console.log('Image from body, stored path:', imagePath);
  } else {
    console.log('No image provided');
  }

  try {
    const course = await Courses.create({
      title,
      description,
      createdBy,
      image: imagePath,
      duration: durationNumber || 0,
      // Satisfy schema fields
      price: priceNumber || 0,
      originalPrice: priceNumber || 0,
      discountedPrice: priceNumber || 0,
      category,
      syllabus: typeof req.body.syllabus === 'string' ? JSON.parse(req.body.syllabus) : (req.body.syllabus || []),
      whoShouldAttend: typeof req.body.whoShouldAttend === 'string' ? JSON.parse(req.body.whoShouldAttend) : (req.body.whoShouldAttend || []),
      prerequisites: typeof req.body.prerequisites === 'string' ? JSON.parse(req.body.prerequisites) : (req.body.prerequisites || []),
    });

    console.log('Course created successfully:', course);

    res.status(201).json({
      message: "Course Created Successfully",
      course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({
      message: "Failed to create course",
      error: error.message,
      details: error.errors || {}
    });
  }
};

export const addLectures = async (req, res, next) => {
  console.log('=== LECTURE CREATION DEBUG START ===');
  console.log('Request Headers:', req.headers);
  console.log('Request Params:', req.params);
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files);
  console.log('Request File:', req.file);

  try {
    // Validate required fields
    if (!req.params.id) {
      return res.status(400).json({
        message: "Course ID is required"
      });
    }

    const course = await Courses.findById(req.params.id);

    if (!course)
      return res.status(404).json({
        message: "No Course with this id",
      });

    // Validate title and description
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    // Handle file upload
    const files = req.files;
    const lectureData = {
      title,
      description,
      course: course._id,
    };

    // Comprehensive file check
    // Comprehensive file check
    const file = files?.file?.[0] || req.file || req.body.file;
    console.log('Processed File:', file);

    // Add video if file exists
    if (file) {
      lectureData.video = file.path || file;
      console.log('Video Path:', lectureData.video);
    }

    // Create lecture
    const lecture = await Lecture.create(lectureData);

    console.log('Lecture created successfully:', lecture);
    console.log('=== LECTURE CREATION DEBUG END ===');

    res.status(201).json({
      message: "Lecture Added Successfully",
      lecture,
    });
  } catch (error) {
    console.error('=== LECTURE CREATION ERROR ===');
    console.error('Full Error Object:', error);
    
    // Detailed error handling
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Validation Error',
        errors: errors
      });
    }
    
    // Generic server error with detailed logging
    res.status(500).json({
      message: 'Failed to add lecture',
      error: error.message,
      name: error.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteLecture = async (req, res, next) => {
  console.log('Deleting lecture - Lecture ID:', req.params.id);

  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await safeDeleteFile(lecture.video);
    await lecture.deleteOne();

    console.log('Lecture deleted successfully');

    res.json({ message: "Lecture Deleted Successfully" });
  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({
      message: "Failed to delete lecture",
      error: error.message
    });
  }
};

export const deleteCourse = async (req, res, next) => {
  console.log('Deleting course - Course ID:', req.params.id);

  try {
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lectures = await Lecture.find({ course: course._id });

    // Delete lecture videos
    await Promise.all(
      lectures.map(async (lecture) => {
        await safeDeleteFile(lecture.video);
      })
    );

    // Delete course image
    await safeDeleteFile(course.image);

    // Delete lectures from database
    await Lecture.deleteMany({ course: req.params.id });

    // Delete course from database
    await course.deleteOne();

    // Remove course from user subscriptions
    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    console.log('Course deleted successfully');

    res.json({
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      message: "Failed to delete course",
      error: error.message
    });
  }
};

export const getAllStats = async (req, res, next) => {
  try {
    // const totalCoures = (await Courses.find()).length;
    const totalCourses = await Courses.countDocuments({});
    // const totalLectures = (await Lecture.find()).length;
    const totalLectures = await Lecture.countDocuments({});
    // const totalUsers = (await User.find()).length;
    const totalUsers = await User.countDocuments({});

    const totalWorkshops = await Workshop.countDocuments({}); // Placeholder for workshop count if needed

    const stats = {
      courses : totalCourses,
      lectures : totalLectures,
      users : totalUsers,
      workshops : totalWorkshops,
    };

    // res.json({ stats });
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      message: "Failed to retrieve stats",
      error: error.message
    });
  }
  // } finally {
  //   next();
  // }
  // res.json({ message: "stats route works!" });
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json({ users });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      message: "Failed to retrieve users",
      error: error.message
    });
  }
} // Added closing bracket here

export const updateRole = async (req, res, next) => {
  try {
    const { id, role } = req.body;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    user.mainrole = role;
    await user.save();

    res.json({
      message: "Role Updated",
      user,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({
      message: "Failed to update role",
      error: error.message
    });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: "Profile Updated",
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// Enhanced admin functions
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Courses.find().populate('createdBy', 'name email');
    res.json({ courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({
      message: "Failed to retrieve courses",
      error: error.message
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, duration, price, category, syllabus, whoShouldAttend, prerequisites } = req.body;
    
    const course = await Courses.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (duration) course.duration = Number(duration);
    if (price) course.price = Number(price);
    if (category) course.category = category;
    if (syllabus) course.syllabus = JSON.parse(syllabus);
    if (whoShouldAttend) course.whoShouldAttend = JSON.parse(whoShouldAttend);
    if (prerequisites) course.prerequisites = JSON.parse(prerequisites);

    // Handle image update
    if (req.file) {
      await safeDeleteFile(course.image);
      course.image = req.file.filename || path.basename(req.file.path);
    }

    await course.save();

    res.json({
      message: "Course Updated Successfully",
      course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      message: "Failed to update course",
      error: error.message
    });
  }
};

export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().populate('createdBy', 'name email');
    res.json({ workshops });
  } catch (error) {
    console.error('Error getting workshops:', error);
    res.status(500).json({
      message: "Failed to retrieve workshops",
      error: error.message
    });
  }
};

export const createWorkshop = async (req, res) => {
  try {
    // Accept alternate field names from frontend
    const title = req.body.title;
    const description = req.body.description || req.body.about;
    const createdBy = req.body.createdBy || req.body.instructor || 'VHASS SOFTWARES PRIVATE LIMITED';
    const category = req.body.category || 'General';

    // Normalize numeric fields
    const normalizeNumber = (value) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value === 'number') return value;
      const cleaned = String(value).replace(/[^0-9.]/g, '');
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : undefined;
    };
    const duration = normalizeNumber(req.body.duration);
    const price = normalizeNumber(req.body.price);

    // Provide safe defaults for required fields in schema
    const date = req.body.date ? new Date(req.body.date) : new Date();
    const time = req.body.time || '00:00';
    const location = req.body.location || 'Online';

    // Handle image: accept uploaded file or direct URL/poster field
    let imagePath = null;
    
    console.log('=== WORKSHOP IMAGE HANDLING DEBUG ===');
    console.log('req.file:', req.file);
    console.log('req.files:', req.files);
    console.log('req.body.image:', req.body.image);
    console.log('req.body.poster:', req.body.poster);
    
    if (req.file) {
      // Store only the filename, not the full path
      imagePath = req.file.filename || path.basename(req.file.path);
      console.log('Workshop image uploaded, stored path:', imagePath);
    } else if (req.body.image || req.body.poster) {
      // If it's a direct URL, keep it as is
      imagePath = req.body.image || req.body.poster;
      console.log('Workshop image from body, stored path:', imagePath);
    } else {
      console.log('No workshop image provided');
    }

    // Early validation with explicit feedback (only hard-require truly essential)
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description/about');
    if (!createdBy) missingFields.push('createdBy/instructor');
    if (!imagePath) missingFields.push('image/poster');
    if (missingFields.length) {
      return res.status(400).json({ message: 'Missing required fields', missingFields });
    }

    // Coerce numbers; default to 0 if invalid instead of blocking
    const durationNumber = Number.isFinite(duration) ? duration : 0;
    const priceNumber = Number.isFinite(price) ? price : 0;

    const parseArray = (val) => {
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'string') {
        try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr.filter(Boolean) : []; } catch { return val ? [val] : []; }
      }
      return [];
    };

    const workshop = await Workshop.create({
      title,
      description,
      createdBy,
      image: imagePath,
      duration: Number(durationNumber),
      price: Number(priceNumber),
      category,
      date,
      time,
      location,
      syllabus: parseArray(req.body.syllabus),
      whoShouldAttend: parseArray(req.body.whoShouldAttend),
      prerequisites: parseArray(req.body.prerequisites),
    });

    res.status(201).json({
      message: "Workshop Created Successfully",
      workshop
    });
  } catch (error) {
    console.error('Error creating workshop:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({
      message: "Failed to create workshop",
      error: error.message
    });
  }
};

export const updateWorkshop = async (req, res) => {
  try {
    const { title, description, duration, price, category, date, location, syllabus, whoShouldAttend, prerequisites } = req.body;
    
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Update fields
    if (title) workshop.title = title;
    if (description) workshop.description = description;
    if (duration) workshop.duration = Number(duration);
    if (price) workshop.price = Number(price);
    if (category) workshop.category = category;
    if (date) workshop.date = date;
    if (location) workshop.location = location;
    if (syllabus) workshop.syllabus = JSON.parse(syllabus);
    if (whoShouldAttend) workshop.whoShouldAttend = JSON.parse(whoShouldAttend);
    if (prerequisites) workshop.prerequisites = JSON.parse(prerequisites);

    // Handle image update
    if (req.file) {
      await safeDeleteFile(workshop.image);
      workshop.image = req.file.filename || path.basename(req.file.path);
    }

    await workshop.save();

    res.json({
      message: "Workshop Updated Successfully",
      workshop
    });
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(500).json({
      message: "Failed to update workshop",
      error: error.message
    });
  }
};

export const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Delete workshop image
    await safeDeleteFile(workshop.image);

    // Delete workshop from database
    await workshop.deleteOne();

    // Remove workshop from user enrollments
    await User.updateMany({}, { $pull: { workshopEnrollments: req.params.id } });

    res.json({ message: "Workshop Deleted Successfully" });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({
      message: "Failed to delete workshop",
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // Delete user avatar if exists
    if (user.avatar) {
      await safeDeleteFile(user.avatar);
    }

    await user.deleteOne();

    res.json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({
      message: "Failed to retrieve user details",
      error: error.message
    });
  }
};

// Get all enrollments (users enrolled in courses/workshops)
export const getAllEnrollments = async (req, res) => {
  try {
    // Get course enrollments
    const courseEnrollments = await User.find({
      subscription: { $exists: true, $ne: [] }
    }).populate('subscription', 'title price category').select('name email subscription');

    // Get workshop enrollments
    const workshopEnrollments = await User.find({
      workshopSubscription: { $exists: true, $ne: [] }
    }).populate('workshopSubscription', 'title price category').select('name email workshopSubscription');

    // Get transaction data for enrollment dates
    const transactions = await Transaction.find({
      transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
    }).populate('userID', 'name email').populate('courseID', 'title').populate('workshopID', 'title');

    res.json({
      courseEnrollments,
      workshopEnrollments,
      transactions: transactions.map(t => ({
        _id: t._id,
        user: t.userID,
        course: t.courseID,
        workshop: t.workshopID,
        amount: t.finalAmount || t.transactionAmount,
        status: t.transactionStatus,
        enrollmentDate: t.createdAt,
        transactionId: t.merchantOrderID
      }))
    });
  } catch (error) {
    console.error('Error getting enrollments:', error);
    res.status(500).json({
      message: "Failed to retrieve enrollments",
      error: error.message
    });
  }
};

// Get enrollments for a specific course
export const getCourseEnrollments = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Get users enrolled in this course
    const enrolledUsers = await User.find({
      subscription: courseId
    }).select('name email phone createdAt');

    // Get transaction details for this course
    const transactions = await Transaction.find({
      courseID: courseId,
      transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
    }).populate('userID', 'name email').sort({ createdAt: -1 });

    res.json({
      courseId,
      enrolledUsers,
      transactions: transactions.map(t => ({
        _id: t._id,
        user: t.userID,
        amount: t.finalAmount || t.transactionAmount,
        status: t.transactionStatus,
        enrollmentDate: t.createdAt,
        transactionId: t.merchantOrderID
      }))
    });
  } catch (error) {
    console.error('Error getting course enrollments:', error);
    res.status(500).json({
      message: "Failed to retrieve course enrollments",
      error: error.message
    });
  }
};

// Public: handle contact messages from site forms
export const contactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!email || !message) {
      return res.status(400).json({ success: false, message: "Email and message are required" });
    }

    await sendContactMail({ name, email, message });
    // Fire-and-forget acknowledgement to sender (non-blocking)
    try { await sendContactAck({ name, email }); } catch {}
    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error('Contact message error:', error?.message || error);
    // In development, do not block the request; accept and log instead of failing hard
    if ((process.env.NODE_ENV || 'development') !== 'production') {
      console.warn('Dev mode: accepting contact message despite email error');
      return res.status(200).json({ success: true, message: "Message accepted (dev mode). Email delivery disabled.", devNote: error?.message });
    }
    return res.status(500).json({ success: false, message: error?.message || "Failed to send message" });
  }
};
