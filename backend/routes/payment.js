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

export default router;
