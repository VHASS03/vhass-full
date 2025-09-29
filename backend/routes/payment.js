import express from 'express';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { Courses } from '../models/Courses.js';
import { Workshop } from '../models/Workshop.js';
import crypto from 'crypto';

const router = express.Router();

// PhonePe webhook handler
router.post('/phonepe/webhook', async (req, res) => {
  try {
    console.log('📱 PhonePe webhook received:', req.body);
    
    const { 
      merchantId, 
      merchantTransactionId, 
      transactionId, 
      amount, 
      state, 
      responseCode, 
      responseCodeDescription 
    } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({ 
      merchantOrderID: merchantTransactionId 
    });

    if (!transaction) {
      console.log('❌ Transaction not found:', merchantTransactionId);
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update transaction status
    let status = 'PENDING';
    if (state === 'COMPLETED' && responseCode === 'PAYMENT_SUCCESS') {
      status = 'SUCCESS';
    } else if (state === 'FAILED' || responseCode !== 'PAYMENT_SUCCESS') {
      status = 'FAILED';
    }

    transaction.transactionStatus = status;
    transaction.phonepeTransactionId = transactionId;
    transaction.responseCode = responseCode;
    transaction.responseCodeDescription = responseCodeDescription;
    await transaction.save();

    console.log('✅ Transaction updated:', {
      merchantTransactionId,
      status,
      responseCode,
      responseCodeDescription
    });

    // If payment successful, enroll user in course/workshop
    if (status === 'SUCCESS') {
      const user = await User.findById(transaction.userID);
      if (user && transaction.courseID) {
        // Enroll in course
        if (!user.subscription.includes(transaction.courseID)) {
          user.subscription.push(transaction.courseID);
          await user.save();
          console.log('✅ User enrolled in course:', transaction.courseID);
        }
      }
    }

    res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
});

// Manual enrollment fix for existing successful payments
router.post('/fix-enrollment', async (req, res) => {
  try {
    console.log('🔧 Manual enrollment fix requested');
    
    // First, let's see all transactions to understand the data structure
    const allTransactions = await Transaction.find({}).limit(5);
    console.log('🔍 Sample transactions in database:', allTransactions.map(t => ({
      id: t._id,
      status: t.transactionStatus,
      hasCourse: !!t.courseID,
      hasUser: !!t.userID
    })));
    
    // Find all successful transactions that might not be enrolled
    // Check for different possible success statuses
    const successfulTransactions = await Transaction.find({
      $or: [
        { transactionStatus: 'SUCCESS' },
        { transactionStatus: 'COMPLETED' },
        { transactionStatus: 'PAYMENT_SUCCESS' }
      ],
      courseID: { $exists: true, $ne: null }
    }).populate('userID', 'email name subscription').populate('courseID', 'title');
    
    console.log('🔍 Found successful transactions:', successfulTransactions.length);
    console.log('Transaction details:', successfulTransactions.map(t => ({
      id: t._id,
      user: t.userID?.email,
      course: t.courseID?.title,
      status: t.transactionStatus
    })));
    
    let fixedCount = 0;
    const results = [];
    
    for (const transaction of successfulTransactions) {
      if (!transaction.userID || !transaction.courseID) {
        console.log('Skipping transaction - missing user or course:', {
          hasUser: !!transaction.userID,
          hasCourse: !!transaction.courseID
        });
        continue;
      }
      
      const user = transaction.userID;
      const course = transaction.courseID;
      
      // Ensure user has subscription array
      if (!user.subscription) {
        user.subscription = [];
      }
      
      // Check if user is already enrolled
      if (!user.subscription.includes(course._id.toString())) {
        try {
          // Enroll user in course
          await User.findByIdAndUpdate(user._id, {
            $addToSet: { subscription: course._id }
          });
          
          // Add user to course purchasers
          await Courses.findByIdAndUpdate(course._id, {
            $addToSet: { purchasers: user._id }
          });
          
          fixedCount++;
          results.push({
            user: user.email,
            course: course.title,
            transactionId: transaction.merchantOrderID,
            status: 'ENROLLED'
          });
          
          console.log(`✅ Enrolled ${user.email} in ${course.title}`);
        } catch (enrollmentError) {
          console.error(`❌ Failed to enroll ${user.email} in ${course.title}:`, enrollmentError);
          results.push({
            user: user.email,
            course: course.title,
            transactionId: transaction.merchantOrderID,
            status: 'ENROLLMENT_FAILED',
            error: enrollmentError.message
          });
        }
      } else {
        results.push({
          user: user.email,
          course: course.title,
          transactionId: transaction.merchantOrderID,
          status: 'ALREADY_ENROLLED'
        });
      }
    }
    
    res.json({
      success: true,
      message: `Fixed enrollment for ${fixedCount} users`,
      totalTransactions: successfulTransactions.length,
      fixedCount,
      results
    });
    
  } catch (error) {
    console.error('❌ Enrollment fix error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix enrollments',
      error: error.message
    });
  }
});

// Check user's transaction status
router.get('/user-transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await Transaction.find({ userID: userId })
      .populate('courseID', 'title price')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      transactions
    });
    
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transactions',
      error: error.message
    });
  }
});

export default router;
