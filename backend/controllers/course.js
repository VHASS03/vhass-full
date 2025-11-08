// Removed import of instance (Razorpay) from "../index.js"
// import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { Progress } from "../models/Progress.js";
import pkg from 'pg-sdk-node';
import mongoose from "mongoose";
import { randomUUID } from 'crypto';
const { PhonePeClient, StandardCheckoutPayRequest, StandardCheckoutClient, Env, CreateSdkOrderRequest } = pkg;

import { sendTransactMailAdmin, sendTransactMailUser } from "../middlewares/sendMail.js";
import { time } from "console";
import { title } from "process";
// Initialize PhonePe SDK client
// const client = new PhonePeClient({
//   merchantId: 'SU2505141931362838820920',
//   saltKey: '33418406-0957-4ae0-a07a-a6383760ba05',
//   saltIndex: 1,
//   env: 'PRODUCTION',
// });

// Initialize PhonePe StandardCheckoutClient (use env vars; supports PREPROD)
let sdkClient = null;
function getPhonePeClient() {
  if (sdkClient) return sdkClient;
  
  const cid = process.env.PHONEPE_SDK_CLIENT_ID || process.env.PHONEPE_MERCHANT_ID;
  const csecret = process.env.PHONEPE_SDK_CLIENT_SECRET || process.env.PHONEPE_SALT_KEY;
  const cver = Number(process.env.PHONEPE_SDK_VERSION || 1);
  const cenv = (process.env.PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase() === 'PRODUCTION' ? Env.PRODUCTION : Env.PREPROD;
  
  console.log('🔧 PhonePe SDK Configuration:');
  console.log('  Client ID:', cid ? 'Set' : 'Missing');
  console.log('  Client Secret:', csecret ? 'Set' : 'Missing');
  console.log('  Version:', cver);
  console.log('  Environment:', cenv);
  
  try {
    console.log('🚀 Attempting to initialize PhonePe SDK with credentials...');
    sdkClient = StandardCheckoutClient.getInstance(cid, csecret, cver, cenv);
    console.log('✅ PhonePe SDK initialized successfully with credentials');
    return sdkClient;
  } catch (e) {
    console.log('⚠️ Failed to initialize with credentials, trying default...');
    try {
      sdkClient = StandardCheckoutClient.getInstance();
      console.log('✅ PhonePe SDK initialized with default config');
      return sdkClient;
    } catch (defaultError) {
      console.error('❌ Failed to initialize PhonePe SDK:', defaultError.message);
      return null;
    }
  }
}

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  // console.log('Courses from database:', courses);
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: { $in: req.user.subscription } });

  res.json({
    courses,
  });
});

export const getUserCourses = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'subscription',
    model: 'Courses'
  });
  
  const courses = user.subscription || [];

  res.json({
    courses,
  });
});

export const getUserWorkshops = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'workshopSubscription',
    model: 'Workshop'
  });
  
  const workshops = user.workshopSubscription || [];

  res.json({
    workshops,
  });
});

export const getEnrollmentHistory = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  // Get course enrollments with real enrollment dates from transactions
  const courseTransactions = await Transaction.find({
    userID: user._id,
    courseID: { $exists: true, $ne: null },
    transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
  }).populate('courseID', 'title category').sort({ createdAt: -1 });
  
  // Get workshop enrollments with real enrollment dates from transactions
  const workshopTransactions = await Transaction.find({
    userID: user._id,
    workshopID: { $exists: true, $ne: null },
    transactionStatus: { $in: ['SUCCESS', 'COMPLETED', 'PAYMENT_SUCCESS'] }
  }).populate('workshopID', 'title category').sort({ createdAt: -1 });
  
  const history = [
    ...courseTransactions.map(transaction => ({
      _id: transaction.courseID._id,
      title: transaction.courseID.title,
      type: 'course',
      enrollmentDate: transaction.createdAt,
      status: 'enrolled',
      transactionId: transaction.merchantOrderID
    })),
    ...workshopTransactions.map(transaction => ({
      _id: transaction.workshopID._id,
      title: transaction.workshopID.title,
      type: 'workshop',
      enrollmentDate: transaction.createdAt,
      status: 'registered',
      transactionId: transaction.merchantOrderID
    }))
  ];

  res.json({
    history,
  });
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});

export const phonepeCheckout = async (req, res) => {
  try {
    console.log('🚀 PhonePe checkout initiated for course:', req.params.id);
    console.log('👤 User ID:', req.user._id);
    console.log('📝 Request body:', req.body);

    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);
    
    if (!user || !course) {
      console.log('❌ User or course not found');
      return res.status(404).json({ message: 'User or course not found' });
    }
    
    if (user.subscription.includes(course._id)) {
      console.log('❌ User already has this course');
      return res.status(400).json({ message: 'You already have this course' });
    }

    // Coupon support removed: always use course price as final amount
    const originalAmount = Number(course.price);
    const finalAmount = originalAmount;
    const discountAmount = 0;

    const merchantOrderId = randomUUID();
    const amount = Math.round(finalAmount * 100); // in paise

    // Log SDK config for debugging
    console.log('=== PHONEPE SDK CONFIG (COURSE) ===');
    console.log('Client ID:', process.env.PHONEPE_SDK_CLIENT_ID || process.env.PHONEPE_MERCHANT_ID);
    console.log('Environment:', (process.env.PHONEPE_ENVIRONMENT || 'PREPROD'));
    console.log('Original Amount:', originalAmount);
    console.log('Final Amount:', finalAmount);
    console.log('Discount Amount:', discountAmount);
    console.log('Amount (paise):', amount);
    console.log('Merchant Order ID:', merchantOrderId);

    const redirectBase = process.env.PHONEPE_REDIRECT_URL || 'http://localhost:5173';
    
    // Create transaction with coupon information
    console.log('💾 Creating transaction...');
    const txn = await Transaction.create({
      courseID: course._id,
      merchantOrderID: merchantOrderId,
      transactionAmount: finalAmount,
      originalAmount: originalAmount,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      userID: user._id,
      userEmail: user.email,
      transactionStatus: "PENDING",
    });
    console.log('✅ Transaction created:', txn._id);

    const redirectUrl = `${redirectBase}/payment-success/${merchantOrderId}`;
    console.log('🔗 Redirect URL:', redirectUrl);
    
    console.log('🏗️ Building PhonePe request...');
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();
    
    console.log('📱 PhonePe request built:', request);
    
    console.log('🔌 Getting PhonePe client...');
    const client = getPhonePeClient();
    if (!client) {
      throw new Error('Failed to initialize PhonePe client');
    }
    console.log('✅ PhonePe client initialized');
    
    console.log('🚀 Calling PhonePe pay API...');
    const response = await client.pay(request);
    console.log('📱 PhonePe response received:', response);
    
    const checkoutPageUrl = response.redirectUrl;
    if (!checkoutPageUrl) {
      throw new Error('PhonePe response missing redirectUrl');
    }
    
    console.log('✅ Sending success response with checkout URL');
    res.json({ 
      success: true,
      checkoutPageUrl,
      merchantOrderId,
      amount: finalAmount
    });
    
  } catch (err) {
    console.error('❌ PhonePe checkout error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    });
    
    res.status(500).json({
      success: false,
      message: 'Payment gateway error',
      error: err.message || 'Unknown error occurred'
    });
  }
};

export const phonepeStatus = TryCatch(async (req, res) => {
  const merchantOrderId = req.params.merchantOrderId;
  console.log("phonepeStatus (course) – merchantOrderId:", merchantOrderId);

  // Load existing transaction to determine user and course
  let txn = await Transaction.findOne({ merchantOrderID: merchantOrderId });
  if (!txn) {
    console.error("Transaction not found for merchantOrderID:", merchantOrderId);
    return res.status(404).json({ message: 'Transaction not found', status: 'FAILED', merchantOrderId });
  }

  const client = getPhonePeClient();
  if (!client) {
    console.error("PhonePe client not available");
    return res.status(500).json({ message: 'Payment gateway client not available' });
  }
  
  const statusResponse = await client.getOrderStatus(merchantOrderId);
  console.log("PhonePe getOrderStatus response:", statusResponse);

  // Validate response structure
  if (!statusResponse || !statusResponse.paymentDetails || !statusResponse.paymentDetails[0]) {
    console.error("Invalid PhonePe response structure:", statusResponse);
    return res.status(500).json({ message: "Invalid payment response" });
  }

  const paymentDetails = statusResponse.paymentDetails[0];
  const transactionID = paymentDetails.transactionId;
  const transactionMode = paymentDetails.paymentMode;
  const transactionStatus = statusResponse.state;
  // Normalize success across possible variants
  const isSuccess = (
    transactionStatus === 'COMPLETED' ||
    transactionStatus === 'SUCCESS' ||
    statusResponse?.success === true ||
    statusResponse?.code === 'PAYMENT_SUCCESS'
  );

  // Derive user from transaction (fallback to req.user if present)
  let user = null;
  if (txn.userID) {
    user = await User.findById(txn.userID);
  } else if (req.user?._id) {
    user = await User.findById(req.user._id);
  }

  if (!user) {
    console.error("User not found for transaction:", merchantOrderId);
    return res.status(404).json({ message: 'User not found for this transaction' });
  }

  // Update transaction with latest details
  const updatedTxn = await Transaction.findOneAndUpdate(
    { merchantOrderID: merchantOrderId },
    {
      userID: user._id,
      userEmail: user.email,
      transactionID: transactionID,
      transactionType: transactionMode,
      transactionStatus: transactionStatus,
      updatedAt: Date.now(),
    },
    { new: true } // Return updated document
  );

  if (!updatedTxn) {
    console.error("Failed to update transaction:", merchantOrderId);
    return res.status(500).json({ message: 'Failed to update transaction' });
  }

  console.log("Transaction updated successfully:", updatedTxn);

  if (isSuccess) {
    console.log("Payment completed successfully");
    if (user && updatedTxn.courseID) {
      // Enroll idempotently
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { subscription: updatedTxn.courseID },
      });
      await Courses.findByIdAndUpdate(updatedTxn.courseID, {
        $addToSet: { purchasers: user._id },
      });
      console.log("User subscription updated successfully");
    } else {
      console.log('Skipping enrollment due to missing user or course', { hasUser: !!user, hasCourse: !!updatedTxn.courseID });
    }

    const course = updatedTxn.courseID ? await Courses.findById(updatedTxn.courseID) : null;
    if (user && course) {
      const mailData = {
        name: user.name,
        email: user.email,
        course: course.title,
        txnid: transactionID,
        stat: transactionStatus,
        time: updatedTxn.updatedAt,
        amount: updatedTxn.finalAmount || updatedTxn.transactionAmount || 0,
        phone: user.phone || 'Not provided',
        paymentMethod: transactionMode || 'PhonePe',
        orderId: merchantOrderId
      };
      try {
        console.log('📧 Attempting to send emails for course purchase:', {
          userEmail: user.email,
          course: course.title,
          transactionId: transactionID
        });
        await sendTransactMailAdmin("Someone bought your course", mailData);
        console.log('✅ Admin email sent successfully');
        await sendTransactMailUser("Your course purchase was successful! Welcome aboard 🚀", mailData);
        console.log('✅ User email sent successfully');
      } catch (e) {
        console.error('❌ Email send failed:', e.message);
        console.error('Email error stack:', e.stack);
        console.error('Email error details:', e);
      }
    }

    return res.json({ message: "nice", status: "SUCCESS", merchantOrderId, txnid: transactionID });
  } else if (transactionStatus === "FAILED") {
    console.log("Payment failed");

    const course = updatedTxn.courseID ? await Courses.findById(updatedTxn.courseID) : null;
    if (user && course) {
      const data_user = {
        name: user.name,
        email: user.email,
        course: course.title,
        txnid: transactionID,
        stat: transactionStatus,
        time: updatedTxn.updatedAt,
      };
      try {
        await sendTransactMailUser("Course Enrollment not completed ⚠️", data_user);
      } catch (e) {
        console.error('Email send failed:', e.message);
      }
    }

    return res.json({ message: "Payment failed", status: "FAILURE", merchantOrderId, txnid: transactionID });
  } else {
    return res.json({ message: "pending", status: "PENDING", merchantOrderId });
  }
});

// Add createCourse function
export const createCourse = TryCatch(async (req, res) => {
  console.log('Creating course - Request body:', req.body);
  
  const { 
    title, 
    description, 
    originalPrice,
    discountedPrice,
    category, 
    duration, 
    createdBy,
    poster,
    syllabus,
    whoShouldAttend,
    prerequisites 
  } = req.body;
  
  // Validate required fields
  if (!title || !description || !originalPrice || !discountedPrice || !category || !duration || !createdBy || !poster) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
      missingFields: {
        title: !title,
        description: !description,
        originalPrice: !originalPrice,
        discountedPrice: !discountedPrice,
        category: !category,
        duration: !duration,
        createdBy: !createdBy,
        poster: !poster
      }
    });
  }

  try {
    // Validate data types and prices
    if (isNaN(Number(originalPrice)) || isNaN(Number(discountedPrice)) || isNaN(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: "Prices and duration must be valid numbers"
      });
    }

    // Validate that discounted price is less than original price
    if (Number(discountedPrice) >= Number(originalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be less than original price"
      });
    }

    const course = await Courses.create({
      title,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      price: Number(discountedPrice),
      category,
      duration: Number(duration),
      createdBy,
      image: poster,
      syllabus: syllabus || [],
      whoShouldAttend: whoShouldAttend || [],
      prerequisites: prerequisites || []
    });

    console.log('Course created successfully:', course);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A course with this title already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message
    });
  }
});

// Utility: Ensure all courses have a price field
export async function ensureCoursePrices() {
  const courses = await Courses.find();
  for (const course of courses) {
    if (typeof course.price !== 'number' || isNaN(course.price) || course.price <= 0) {
      let newPrice = Number(course.discountedPrice) || Number(course.originalPrice) || 1000;
      course.price = newPrice;
      await course.save();
      console.log(`Updated course ${course._id} with price:`, newPrice);
    }
  }
}

// Call this function manually from a script or at server start for a one-time fix
// ensureCoursePrices();
