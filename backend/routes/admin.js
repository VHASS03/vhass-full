import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
  getAllCourses,
  updateCourse,
  getAllWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  deleteUser,
  getUserDetails,
  getAllEnrollments,
  getCourseEnrollments,
  sendEmailsToExistingPurchasers,
  syncPurchasersArrays,
  sendBillsToSpecificUsers,
} from "../controllers/admin.js";
import { uploadFiles, handleMulterError } from "../middlewares/multer.js";
import { User } from "../models/User.js";
import { testSMTPConnection } from "../middlewares/sendMail.js";

const router = express.Router();

// Middleware to log request details
const logRequestDetails = (req, res, next) => {
  console.log('Admin Route - Request Method:', req.method);
  console.log('Admin Route - Request Path:', req.path);
  console.log('Admin Route - Request Headers:', req.headers);
  console.log('Admin Route - Request Body:', req.body);
  console.log('Admin Route - Request Files:', req.files);
  console.log('Admin Route - Request File:', req.file);
  console.log('Admin Route - Session:', req.session);
  console.log('Admin Route - User:', req.user);
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Admin Route - Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// CORS Preflight handler
router.options('*', (req, res) => {
  // const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
  // const allowedOrigins = [process.env.FRONTEND_URL, process.env.PHONEPE_REDIRECT_URL];
  const allowedOrigins = [process.env.FRONTEND_URL, process.env.PHONEPE_REDIRECT_URL];
  const origin = req.header('origin');
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');
  res.sendStatus(204);
});

// Get all stats route
// router.get('/stats', isAuth, isAdmin, getAllStats);
router.get('/stats', getAllStats);
router.get('/test', (req, res) => {
  res.json({ message: "Test route works!" });
});

// Debug route to test image upload
router.post("/test-image", isAuth, isAdmin, uploadFiles.single('image'), (req, res) => {
  try {
    console.log('=== IMAGE UPLOAD TEST ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request files:', req.files);
    
    if (req.file) {
      console.log('File uploaded successfully:');
      console.log('- Original name:', req.file.originalname);
      console.log('- Filename:', req.file.filename);
      console.log('- Path:', req.file.path);
      console.log('- Size:', req.file.size);
      console.log('- Mimetype:', req.file.mimetype);
      
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        file: {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: `/uploads/${req.file.filename}`
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }
  } catch (error) {
    console.error('Image upload test error:', error);
    res.status(500).json({
      success: false,
      message: 'Image upload test failed',
      error: error.message
    });
  }
});

// Routes that handle file uploads
router.post("/course/:id", isAuth, isAdmin, uploadFiles.fields([{ name: 'file', maxCount: 1 }]), addLectures);

// Routes that don't handle file uploads
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.put("/user/:id", isAuth, updateRole);
router.get("/users", isAuth, isAdmin, getAllUser);
router.post("/user", isAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      role: role || 'user'
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: "User created successfully",
      user: newUser 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// Enhanced admin routes
router.post("/course", isAuth, isAdmin, uploadFiles.single('image'), createCourse);
router.get("/courses", isAuth, isAdmin, getAllCourses);
router.put("/course/:id", isAuth, isAdmin, uploadFiles.single('image'), updateCourse);
router.get("/workshops", isAuth, isAdmin, getAllWorkshops);
router.post("/workshop", isAuth, isAdmin, uploadFiles.single('image'), createWorkshop);
router.put("/workshop/:id", isAuth, isAdmin, uploadFiles.single('image'), updateWorkshop);
router.delete("/workshop/:id", isAuth, isAdmin, deleteWorkshop);
router.delete("/user/:id", isAuth, isAdmin, deleteUser);
router.get("/user/:id", isAuth, isAdmin, getUserDetails);

// Enrollment management routes
router.get("/enrollments", isAuth, isAdmin, getAllEnrollments);
router.get("/course/:courseId/enrollments", isAuth, isAdmin, getCourseEnrollments);

// Send emails to existing purchasers
router.post("/send-emails-to-purchasers", isAuth, isAdmin, sendEmailsToExistingPurchasers);

// Sync purchasers arrays (helper endpoint)
router.post("/sync-purchasers", isAuth, isAdmin, async (req, res) => {
  try {
    await syncPurchasersArrays();
    res.json({ success: true, message: "Purchasers arrays synced successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send bills to specific users (the three transactions from the image)
router.post("/send-bills-to-specific-users", isAuth, isAdmin, sendBillsToSpecificUsers);

// Test route to verify endpoint is accessible (remove after testing)
router.get("/test-bills-endpoint", (req, res) => {
  res.json({ 
    message: "Bills endpoint is accessible",
    endpoint: "/api/admin/send-bills-to-specific-users",
    method: "POST"
  });
});

// Test SMTP connection endpoint
router.get("/test-smtp", async (req, res) => {
  try {
    const result = await testSMTPConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Catch-all 404 handler
router.use((req, res) => {
  console.error('Admin Route - 404 Not Found:', {
    method: req.method,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    url: req.url,
    headers: req.headers
  });
  res.status(404).json({
    message: 'Route not found',
    details: {
      method: req.method,
      path: req.path
    }
  });
});

// Error handler should be last
router.use(errorHandler);

export default router;
