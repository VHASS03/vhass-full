import TryCatch from "../middlewares/TryCatch.js";
import { Workshop } from "../models/Workshop.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { sendTransactMailAdmin, sendTransactMailUser } from "../middlewares/sendMail.js";
import { randomUUID } from "crypto";
import pkg from 'pg-sdk-node';
const { PhonePeClient, StandardCheckoutPayRequest, StandardCheckoutClient, Env, CreateSdkOrderRequest } = pkg;

// Initialize PhonePe StandardCheckoutClient (use env vars; supports PREPROD)
let sdkClient = null;
function getPhonePeClient() {
  if (sdkClient) return sdkClient;
  const cid = process.env.PHONEPE_SDK_CLIENT_ID || process.env.PHONEPE_MERCHANT_ID;
  const csecret = process.env.PHONEPE_SDK_CLIENT_SECRET || process.env.PHONEPE_SALT_KEY;
  const cver = Number(process.env.PHONEPE_SDK_VERSION || 1);
  const cenv = (process.env.PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase() === 'PRODUCTION' ? Env.PRODUCTION : Env.PREPROD;
  try {
    sdkClient = StandardCheckoutClient.getInstance(cid, csecret, cver, cenv);
  } catch (e) {
    try {
      sdkClient = StandardCheckoutClient.getInstance();
    } catch {}
  }
  return sdkClient;
}

export const getAllWorkshops = TryCatch(async (req, res) => {
  const workshops = await Workshop.find();
  res.json({
    workshops,
  });
});

export const getSingleWorkshop = TryCatch(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);
  res.json({
    workshop,
  });
});

export const getMyWorkshops = TryCatch(async (req, res) => {
  const workshops = await Workshop.find({ _id: req.user.workshopSubscription });
  res.json({
    workshops,
  });
});

export const createWorkshop = TryCatch(async (req, res) => {
  try {
    console.log('Full request body:', req.body);
    console.log('Full request files:', req.files);
    console.log('Full request file:', req.file);

    const { title, description, createdBy, duration, price, category, date, time, location,poster, syllabus, whoShouldAttend, prerequisites } = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'createdBy', 'duration', 'price', 'category', 'date', 'time', 'location', 'poster'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `Missing required field: ${field}`
        });
      }
    }

    // // Handle file upload
    // const image = req.file || req.files?.file;
    // if (!image) {
    //   console.error("No file uploaded");
    //   return res.status(400).json({
    //     message: "Please upload an image file"
    //   });
    // }

    // // Parse array fields
    // const parseSafeArray = (field) => {
    //   try {
    //     return Array.isArray(req.body[field]) ? req.body[field] : 
    //            (typeof req.body[field] === 'string' ? JSON.parse(req.body[field]) : [])
    //   } catch {
    //     return [];
    //   }
    // };

    // console.log("File details:", {
    //   filename: image.filename,
    //   path: image.path,
    //   mimetype: image.mimetype,
    //   size: image.size
    // });

    // Validate required fields
    if (!title || !description || !createdBy || !duration || !price || !category || !date || !time || !location) {
      console.error("Missing required fields");
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const workshop = await Workshop.create({
      title,
      description,
      createdBy,
      image: poster,
      duration,
      price,
      category,
      date,
      time,
      location,
      syllabus: syllabus || [],
      whoShouldAttend: whoShouldAttend || [],
      prerequisites: prerequisites || [],
    });

    console.log("Workshop created successfully:", workshop);

    res.status(201).json({
      message: "Workshop Created Successfully",
      workshop
    });
  } catch (error) {
    console.error("Error creating workshop:", error);
    
    // // If workshop creation fails, delete the uploaded file
    // if (req.file && req.file.path) {
    //   try {
    //     await fs.promises.unlink(req.file.path);
    //     console.log("Deleted uploaded file after error");
    //   } catch (unlinkError) {
    //     console.error('Error deleting file:', unlinkError);
    //   }
    // }
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
        message: "A workshop with this title already exists"
      });
    }
    // Send detailed error message
    res.status(500).json({
      message: "Failed to create workshop",
      error: error.message,
      details: error.stack
    });
  }
});

export const deleteWorkshop = TryCatch(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);
  if (!workshop) return res.status(404).json({ message: "Workshop not found" });

  await workshop.deleteOne();

  res.json({
    message: "Workshop Deleted Successfully",
  });
});

export const phonepeCheckout = async (req, res) => {
  try {
  const user = await User.findById(req.user._id);
  const workshop = await Workshop.findById(req.params.id);
    if (!user || !workshop) {
      return res.status(404).json({ message: 'User or workshop not found' });
    }
  if (user.workshopSubscription.includes(workshop._id)) {
      return res.status(400).json({ message: 'You already have this workshop' });
  }
    const merchantOrderId = randomUUID();
    const amount = Math.round(Number(workshop.price) * 100); // in paise
    
    // Create transaction record
    const txn = await Transaction.create({
      workshopID: workshop._id,
      merchantOrderID: merchantOrderId,
      transactionAmount: workshop.price,
      transactionStatus: "PENDING",
    });
    
    const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment-success/${merchantOrderId}`;
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();
    const client = getPhonePeClient();
    const response = await client.pay(request);
    const checkoutPageUrl = response.redirectUrl;
    res.json({ checkoutPageUrl });
  } catch (err) {
    console.error('PhonePe API Error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Payment gateway error',
      error: err.response?.data || err.message
    });
  }
};

export const phonepeStatus = TryCatch(async (req, res) => {
  const merchantOrderId = req.params.transactionId;
  console.log("phonepeStatus (workshop) – merchantOrderId:", merchantOrderId);

  const user = await User.findById(req.user._id);
  const userID = user._id;
  const userEmail = user.email;

  const client = getPhonePeClient();
  const statusResponse = await client.getOrderStatus(merchantOrderId);

  console.log("PhonePe getOrderStatus response:", statusResponse);

  const transactionID = statusResponse.paymentDetails[0].transactionId;
  const transactionMode = statusResponse.paymentDetails[0].paymentMode;
  const transactionStatus = statusResponse.state;
  // Normalize success across possible variants
  const isSuccess = (
    transactionStatus === 'COMPLETED' ||
    transactionStatus === 'SUCCESS' ||
    statusResponse?.success === true ||
    statusResponse?.code === 'PAYMENT_SUCCESS'
  );

  if (isSuccess) {
    console.log("Payment completed successfully");
    await Transaction.findOneAndUpdate(
      { merchantOrderID: merchantOrderId },
      {
        userID: userID,
        userEmail: userEmail,
        transactionID: transactionID,
        transactionType: transactionMode,
        transactionStatus: transactionStatus,
        updatedAt: Date.now()
      }
    );
    console.log("Transaction updated successfully");
    
    const txn = await Transaction.findOne({
      merchantOrderID: merchantOrderId,
    });
    console.log("Transaction found:", txn);
    
    // Add workshop to user's subscription
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { workshopSubscription: txn.workshopID },
    });

    await Workshop.findByIdAndUpdate(txn.workshopID, {
      $addToSet: { purchasers: user._id },
    });

    console.log("User workshop subscription updated successfully");

    const workshop = await Workshop.findById(txn.workshopID);

    const data = {
      name: user.name,
      email: user.email,
      course: workshop.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailAdmin("Someone registered for your workshop", data);

    const data_user = {
      name: user.name,
      email: user.email,
      course: workshop.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailUser("Your workshop registration was successful! Welcome aboard 🚀", data_user);

    return res.json({ message: "nice", status: "SUCCESS", merchantOrderId, txnid: transactionID });
  } else if (statusResponse.state === "FAILED") {
    console.log("Payment completed failed");
    await Transaction.findOneAndUpdate(
      { merchantOrderID: merchantOrderId },
      {
        userID: userID,
        userEmail: userEmail,
        transactionID: transactionID,
        transactionType: transactionMode,
        transactionStatus: transactionStatus,
        updatedAt: Date.now()
      }
    );
    console.log("Transaction updated failed");

    const txn = await Transaction.findOne({
      merchantOrderID: merchantOrderId,
    });

    const workshop = await Workshop.findById(txn.workshopID);

    const data_user = {
      name: user.name,
      email: user.email,
      course: workshop.title,
      txnid: transactionID,
      stat: transactionStatus,
      time: txn.updatedAt,
    };

    await sendTransactMailUser("Your workshop registration failed", data_user);

    return res.json({ message: "Payment failed", status: "FAILED", merchantOrderId, txnid: transactionID });
  } else {
    return res.json({ message: "Payment pending", status: "PENDING", merchantOrderId });
  }
}); 
