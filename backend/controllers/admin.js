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
import { sendContactMail, sendContactAck, sendTransactMailAdmin, sendTransactMailUser } from "../middlewares/sendMail.js";

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
    const courses = await Courses.find().populate('createdBy', 'name email').populate('purchasers', 'name email');
    
    // Add enrollment count to each course
    const coursesWithEnrollments = await Promise.all(courses.map(async (course) => {
      // Get enrollment count from purchasers array
      const enrollmentCount = course.purchasers ? course.purchasers.length : 0;
      
      // Also get count from transactions as backup
      const transactionCount = await Transaction.countDocuments({
        courseID: course._id,
        transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
      });
      
      // Use the higher count (in case purchasers array is not synced)
      const finalCount = Math.max(enrollmentCount, transactionCount);
      
      return {
        ...course.toObject(),
        enrollmentCount: finalCount,
        purchasersCount: enrollmentCount,
        transactionCount: transactionCount
      };
    }));
    
    res.json({ courses: coursesWithEnrollments });
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
        user: t.userID ? {
          name: t.userID.name || 'User',
          email: t.userID.email || t.userEmail || 'No email available'
        } : {
          name: 'User',
          email: t.userEmail || 'No email available'
        },
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

// Send emails to all existing purchasers
export const sendEmailsToExistingPurchasers = async (req, res) => {
  try {
    console.log('📧 Starting bulk email send to existing purchasers...');
    
    // First, sync purchasers arrays to ensure data is accurate
    console.log('🔄 Syncing purchasers arrays...');
    await syncPurchasersArrays();
    
    // Find all successful transactions
    const successfulTransactions = await Transaction.find({
      transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
    })
      .populate('userID', 'name email phone')
      .populate('courseID', 'title')
      .populate('workshopID', 'title')
      .sort({ createdAt: 1 }); // Oldest first

    console.log(`Found ${successfulTransactions.length} successful transactions`);

    const results = {
      total: successfulTransactions.length,
      sent: 0,
      failed: 0,
      skipped: 0,
      details: []
    };

    // Process each transaction
    for (const transaction of successfulTransactions) {
      try {
        // Get user - try populated first, then fetch if needed
        let user = transaction.userID;
        if (!user && transaction.userID) {
          user = await User.findById(transaction.userID);
        }
        
        if (!user || !user.email) {
          console.log(`⚠️ Skipping transaction ${transaction.merchantOrderID} - no user or email`);
          results.skipped++;
          results.details.push({
            transactionId: transaction.merchantOrderID,
            status: 'skipped',
            reason: 'No user or email found'
          });
          continue;
        }

        let itemTitle = '';
        let itemType = '';
        let mailData = null;

        // Handle course purchase
        if (transaction.courseID) {
          const course = transaction.courseID;
          // If courseID is just an ID, fetch the full course
          const courseObj = typeof course === 'object' ? course : await Courses.findById(course);
          itemTitle = courseObj?.title || 'Course';
          itemType = 'course';
          
          mailData = {
            name: user.name,
            email: user.email,
            course: itemTitle,
            txnid: transaction.transactionID || transaction.merchantOrderID,
            stat: transaction.transactionStatus,
            time: transaction.updatedAt || transaction.createdAt,
            amount: transaction.finalAmount || transaction.transactionAmount || 0,
            phone: user.phone || 'Not provided',
            paymentMethod: transaction.transactionType || 'PhonePe',
            orderId: transaction.merchantOrderID
          };

          // Send emails
          await sendTransactMailUser("Your course purchase confirmation - Vhass Academy", mailData);
          console.log(`✅ Email sent to ${user.email} for course: ${itemTitle}`);
          results.sent++;
          results.details.push({
            transactionId: transaction.merchantOrderID,
            userEmail: user.email,
            item: itemTitle,
            type: itemType,
            status: 'sent'
          });

        } 
        // Handle workshop purchase
        else if (transaction.workshopID) {
          const workshop = transaction.workshopID;
          // If workshopID is just an ID, fetch the full workshop
          const workshopObj = typeof workshop === 'object' ? workshop : await Workshop.findById(workshop);
          itemTitle = workshopObj?.title || 'Workshop';
          itemType = 'workshop';
          
          mailData = {
            name: user.name,
            email: user.email,
            course: itemTitle, // Using 'course' field for template compatibility
            txnid: transaction.transactionID || transaction.merchantOrderID,
            stat: transaction.transactionStatus,
            time: transaction.updatedAt || transaction.createdAt,
            amount: transaction.finalAmount || transaction.transactionAmount || 0,
            phone: user.phone || 'Not provided',
            paymentMethod: transaction.transactionType || 'PhonePe',
            orderId: transaction.merchantOrderID
          };

          // Send emails
          await sendTransactMailUser("Your workshop registration confirmation - Vhass Academy", mailData);
          console.log(`✅ Email sent to ${user.email} for workshop: ${itemTitle}`);
          results.sent++;
          results.details.push({
            transactionId: transaction.merchantOrderID,
            userEmail: user.email,
            item: itemTitle,
            type: itemType,
            status: 'sent'
          });
        } else {
          console.log(`⚠️ Skipping transaction ${transaction.merchantOrderID} - no course or workshop`);
          results.skipped++;
          results.details.push({
            transactionId: transaction.merchantOrderID,
            status: 'skipped',
            reason: 'No course or workshop found'
          });
        }

        // Small delay to avoid overwhelming email service
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Failed to send email for transaction ${transaction.merchantOrderID}:`, error.message);
        results.failed++;
        results.details.push({
          transactionId: transaction.merchantOrderID,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`📧 Bulk email send completed: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);

    res.json({
      success: true,
      message: `Email sending completed: ${results.sent} emails sent, ${results.failed} failed, ${results.skipped} skipped`,
      results
    });

  } catch (error) {
    console.error('❌ Error sending emails to existing purchasers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails to existing purchasers',
      error: error.message
    });
  }
};

// Helper function to sync purchasers arrays for courses and workshops
export const syncPurchasersArrays = async () => {
  try {
    console.log('🔄 Syncing purchasers arrays...');
    
    // Sync course purchasers
    const courseTransactions = await Transaction.find({
      courseID: { $exists: true, $ne: null },
      transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
    }).select('courseID userID');
    
    const coursePurchasersMap = new Map();
    courseTransactions.forEach(txn => {
      if (txn.courseID && txn.userID) {
        const courseId = String(txn.courseID);
        if (!coursePurchasersMap.has(courseId)) {
          coursePurchasersMap.set(courseId, new Set());
        }
        coursePurchasersMap.get(courseId).add(String(txn.userID));
      }
    });
    
    // Update each course's purchasers array
    for (const [courseId, userIds] of coursePurchasersMap.entries()) {
      await Courses.findByIdAndUpdate(courseId, {
        purchasers: Array.from(userIds)
      });
    }
    
    console.log(`✅ Synced purchasers for ${coursePurchasersMap.size} courses`);
    
    // Sync workshop purchasers
    const workshopTransactions = await Transaction.find({
      workshopID: { $exists: true, $ne: null },
      transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
    }).select('workshopID userID');
    
    const workshopPurchasersMap = new Map();
    workshopTransactions.forEach(txn => {
      if (txn.workshopID && txn.userID) {
        const workshopId = String(txn.workshopID);
        if (!workshopPurchasersMap.has(workshopId)) {
          workshopPurchasersMap.set(workshopId, new Set());
        }
        workshopPurchasersMap.get(workshopId).add(String(txn.userID));
      }
    });
    
    // Update each workshop's purchasers array
    for (const [workshopId, userIds] of workshopPurchasersMap.entries()) {
      await Workshop.findByIdAndUpdate(workshopId, {
        purchasers: Array.from(userIds)
      });
    }
    
    console.log(`✅ Synced purchasers for ${workshopPurchasersMap.size} workshops`);
    
  } catch (error) {
    console.error('❌ Error syncing purchasers arrays:', error);
    throw error;
  }
};

// Send bills to all users (or specific users if transaction IDs provided)
export const sendBillsToSpecificUsers = async (req, res) => {
  try {
    // Get transaction IDs from request body, or use default three if not provided
    const { transactionIds } = req.body;
    
    let targetTransactionIds = transactionIds;
    
    // If no transaction IDs provided, send to all successful transactions
    if (!targetTransactionIds || targetTransactionIds.length === 0) {
      console.log('📧 No specific transaction IDs provided, sending to all successful transactions...');
      
      // Find all successful transactions with populated userID
      const allSuccessfulTransactions = await Transaction.find({
        transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] },
        userID: { $exists: true, $ne: null }
      })
      .populate('userID', 'name email phone')
      .populate('courseID', 'title')
      .populate('workshopID', 'title');
      
      console.log(`Found ${allSuccessfulTransactions.length} successful transactions with users`);
      
      // Filter to only include transactions with valid user emails and process directly
      const validTransactions = allSuccessfulTransactions.filter(txn => {
        const user = txn.userID;
        return user && user.email && user.email.trim() !== '';
      });
      
      console.log(`Found ${validTransactions.length} transactions with valid user emails`);
      
      // Process transactions directly instead of looking them up again
      for (const transaction of validTransactions) {
        try {
          const transactionId = transaction.transactionID || transaction.merchantOrderID;
          const user = transaction.userID;

          if (!user || !user.email) {
            results.skipped++;
            results.details.push({
              transactionId,
              status: 'skipped',
              reason: 'User has no email'
            });
            continue;
          }

          // Get item details
          let itemTitle = '';
          let itemType = '';
          
          if (transaction.courseID) {
            const course = typeof transaction.courseID === 'object' ? transaction.courseID : await Courses.findById(transaction.courseID);
            itemTitle = course?.title || 'Course';
            itemType = 'course';
          } else if (transaction.workshopID) {
            const workshop = typeof transaction.workshopID === 'object' ? transaction.workshopID : await Workshop.findById(transaction.workshopID);
            itemTitle = workshop?.title || 'Workshop';
            itemType = 'workshop';
          } else {
            itemTitle = 'Course/Workshop';
            itemType = 'unknown';
          }

          const amount = transaction.finalAmount || transaction.transactionAmount || 0;
          const formattedTime = transaction.updatedAt || transaction.createdAt || new Date();

          // Prepare email data
          const mailData = {
            name: user.name,
            email: user.email,
            course: itemTitle,
            txnid: transaction.transactionID || transaction.merchantOrderID,
            stat: transaction.transactionStatus,
            time: formattedTime,
            amount: amount,
            phone: user.phone || 'Not provided',
            paymentMethod: transaction.transactionType || 'PhonePe',
            orderId: transaction.merchantOrderID
          };

          // Send email
          let emailStatus = 'failed';
          try {
            await sendTransactMailUser("Your purchase bill - Vhass Academy", mailData);
            console.log(`✅ Email sent to ${user.email} for transaction ${transactionId}`);
            results.emailsSent++;
            emailStatus = 'sent';
          } catch (emailError) {
            console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
            console.error(`Email error details:`, emailError);
            results.failed++;
            emailStatus = 'failed';
          }

          results.details.push({
            transactionId,
            userEmail: user.email,
            userPhone: user.phone || 'Not provided',
            item: itemTitle,
            type: itemType,
            amount: amount,
            emailStatus: emailStatus
          });

          // Small delay between sends to avoid overwhelming email service
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          const transactionId = transaction.transactionID || transaction.merchantOrderID;
          console.error(`❌ Error processing transaction ${transactionId}:`, error.message);
          results.failed++;
          results.details.push({
            transactionId,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Return early since we've processed all transactions
      console.log(`📧 Bill sending completed: ${results.emailsSent} emails sent, ${results.failed} failed, ${results.skipped} skipped`);

      const skippedReasons = {};
      results.details.forEach(detail => {
        if (detail.status === 'skipped' || detail.emailStatus === 'failed') {
          const reason = detail.reason || detail.error || 'Unknown';
          skippedReasons[reason] = (skippedReasons[reason] || 0) + 1;
        }
      });

      return res.json({
        success: true,
        message: `Bills sent: ${results.emailsSent} emails sent out of ${validTransactions.length} transactions`,
        results: {
          ...results,
          skippedReasons: Object.keys(skippedReasons).length > 0 ? skippedReasons : undefined
        }
      });
    } else {
      console.log(`📧 Sending bills to ${targetTransactionIds.length} specific transactions...`);
    }

    const results = {
      total: targetTransactionIds.length,
      emailsSent: 0,
      failed: 0,
      skipped: 0,
      details: []
    };

    for (const transactionId of targetTransactionIds) {
      try {
        // Find transaction by merchantOrderID (transaction ID)
        const transaction = await Transaction.findOne({
          $or: [
            { merchantOrderID: transactionId },
            { transactionID: transactionId }
          ]
        })
          .populate('userID', 'name email phone')
          .populate('courseID', 'title')
          .populate('workshopID', 'title');

        if (!transaction) {
          console.log(`⚠️ Transaction not found: ${transactionId}`);
          results.skipped++;
          results.details.push({
            transactionId,
            status: 'skipped',
            reason: 'Transaction not found'
          });
          continue;
        }

        // Get user
        let user = transaction.userID;
        if (!user && transaction.userID) {
          user = await User.findById(transaction.userID);
        }

        if (!user) {
          console.log(`⚠️ User not found for transaction: ${transactionId}, userID: ${transaction.userID}`);
          results.skipped++;
          results.details.push({
            transactionId,
            status: 'skipped',
            reason: 'User not found',
            userID: transaction.userID ? String(transaction.userID) : 'missing'
          });
          continue;
        }

        if (!user.email) {
          console.log(`⚠️ User has no email for transaction: ${transactionId}, user: ${user.name || user._id}`);
          results.skipped++;
          results.details.push({
            transactionId,
            status: 'skipped',
            reason: 'User has no email',
            userName: user.name,
            userId: String(user._id)
          });
          continue;
        }

        // Get item details
        let itemTitle = '';
        let itemType = '';
        
        if (transaction.courseID) {
          const course = typeof transaction.courseID === 'object' 
            ? transaction.courseID 
            : await Courses.findById(transaction.courseID);
          itemTitle = course?.title || 'Course';
          itemType = 'course';
        } else if (transaction.workshopID) {
          const workshop = typeof transaction.workshopID === 'object'
            ? transaction.workshopID
            : await Workshop.findById(transaction.workshopID);
          itemTitle = workshop?.title || 'Workshop';
          itemType = 'workshop';
        } else {
          itemTitle = 'Course/Workshop';
          itemType = 'unknown';
        }

        const amount = transaction.finalAmount || transaction.transactionAmount || 0;
        const formattedTime = transaction.updatedAt || transaction.createdAt || new Date();

        // Prepare email data
        const mailData = {
          name: user.name,
          email: user.email,
          course: itemTitle,
          txnid: transaction.transactionID || transaction.merchantOrderID,
          stat: transaction.transactionStatus,
          time: formattedTime,
          amount: amount,
          phone: user.phone || 'Not provided',
          paymentMethod: transaction.transactionType || 'PhonePe',
          orderId: transaction.merchantOrderID
        };

        // Send email
        let emailStatus = 'failed';
        try {
          await sendTransactMailUser("Your purchase bill - Vhass Academy", mailData);
          console.log(`✅ Email sent to ${user.email} for transaction ${transactionId}`);
          results.emailsSent++;
          emailStatus = 'sent';
        } catch (emailError) {
          console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
          console.error(`Email error details:`, emailError);
          results.failed++;
          emailStatus = 'failed';
        }

        results.details.push({
          transactionId,
          userEmail: user.email,
          userPhone: user.phone || 'Not provided',
          item: itemTitle,
          type: itemType,
          amount: amount,
          emailStatus: emailStatus
        });

        // Small delay between sends to avoid overwhelming email service
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Error processing transaction ${transactionId}:`, error.message);
        results.failed++;
        results.details.push({
          transactionId,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`📧 Bill sending completed: ${results.emailsSent} emails sent, ${results.failed} failed, ${results.skipped} skipped`);

    // Add summary of skipped reasons
    const skippedReasons = {};
    results.details.forEach(detail => {
      if (detail.status === 'skipped' || detail.emailStatus === 'failed') {
        const reason = detail.reason || detail.error || 'Unknown';
        skippedReasons[reason] = (skippedReasons[reason] || 0) + 1;
      }
    });

    res.json({
      success: true,
      message: `Bills sent: ${results.emailsSent} emails sent out of ${results.total} transactions`,
      results: {
        ...results,
        skippedReasons: Object.keys(skippedReasons).length > 0 ? skippedReasons : undefined
      }
    });

  } catch (error) {
    console.error('❌ Error sending bills to users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bills',
      error: error.message
    });
  }
};
