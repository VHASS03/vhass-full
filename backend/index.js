// --- Load environment variables FIRST ---
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from 'dotenv';
// Compute __dirname before using it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? 'config.env.production' : 'config.env';
const envPath = resolve(__dirname, envFile);
dotenv.config({ path: envPath });

// Get the directory name (already computed above)
console.log("PORT:", process.env.PORT);

// Set frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? 'https://www.vhassacademy.com' : 'http://localhost:5173');

// Load environment variables manually (Windows and Unix compatible)

// --- Now import everything else ---
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import passport from './config/passport.js';

const app = express();

// Serve files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('trust proxy', 1); // trust first proxy

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://vhassacademy.com',
      'https://www.vhassacademy.com',
      'https://api.vhassacademy.com',
      'https://www.vhass.in',
      'https://api.vhass.in',
      'https://vhass-frontend.onrender.com',
      'https://vhass-backend.onrender.com',
      'https://api.vhassacademy.com',
      'https://vhass-front.vercel.app',
      'https://vhass-front-6682o09ot-vhass-projects-7b5ca00b.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    console.log('🔍 CORS check for origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS allowed origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(null, false); // Don't throw error, just return false
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Token', 'Accept', 'Origin', 'X-Requested-With', 'X-VERIFY', 'X-MERCHANT-ID'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true for production
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global OPTIONS handler for CORS preflight - let the CORS middleware handle it
app.options('*', cors());

// Additional CORS headers for all responses
app.use((req, res, next) => {
  const allowedOrigins = ['https://www.vhassacademy.com', 'https://vhassacademy.com'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, Token, Accept, Origin, X-Requested-With, X-VERIFY, X-MERCHANT-ID');
  
  next();
});

const port = 5001;

app.get("/", (req, res) => {
  res.send("Server is working");
});

// Handle OAuth callback redirect to /auth
app.get('/auth', (req, res) => {
  console.log('Handling /auth route - redirecting to frontend with session check');
  
  // Check if user is authenticated via session
  if (req.session && req.session.user) {
    console.log('User authenticated, redirecting to frontend');
    res.redirect(process.env.FRONTEND_URL);
  } else {
    console.log('User not authenticated, redirecting to login');
    res.redirect(`${process.env.FRONTEND_URL}/auth`);
  }
});

// Redirect from /auth/google to /api/auth/google for compatibility
app.get('/auth/google', (req, res) => {
  console.log('Redirecting from /auth/google to /api/auth/google');
  res.redirect('/api/auth/google');
});

// Serve static files from the uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsPath); // Debug log

app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Debug route to check if files exist
app.get("/uploads/check/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsPath, filename);
  const exists = require('fs').existsSync(filePath);
  res.json({
    exists,
    path: filePath,
    filename
  });
});

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import workshopRoutes from "./routes/workshop.js";
import paymentRoutes from "./routes/payment.js";

// using routes
app.use("/api/admin", adminRoutes);
console.log('Registered admin routes:', adminRoutes.stack.map(r => r.route ? `/admin${r.route.path}` : 'unknown'));

app.use("/api/auth", authRoutes);
console.log('Registered auth routes:', authRoutes.stack.map(r => r.route ? r.route.path : 'unknown'));

app.use("/api", userRoutes);
console.log('Registered user routes:', userRoutes.stack.map(r => r.route ? r.route.path : 'unknown'));

app.use("/api", courseRoutes);
console.log('Registered course routes:', courseRoutes.stack.map(r => r.route ? r.route.path : 'unknown'));

app.use("/api", workshopRoutes);
console.log('Registered workshop routes:', workshopRoutes.stack.map(r => r.route ? r.route.path : 'unknown'));

app.use("/api/payment", paymentRoutes);
console.log('Registered payment routes:', paymentRoutes.stack.map(r => r.route ? r.route.path : 'unknown'));



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for /uploads
app.use('/uploads', (req, res) => {
  res.status(404).json({ 
    error: 'File not found',
    path: req.path,
    uploadsPath
  });
});

// Connect to MongoDB with environment-aware options
const mongoUri = process.env.MONGODB_URI;
console.log('🔍 MongoDB URI check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI value:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

const isLocalMongo = /^mongodb:\/\/(localhost|127\.0\.0\.1)/.test(mongoUri || '');

const connectionOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Avoid forcing TLS/SSL for local development
  ...(isLocalMongo ? {} : {}),
};

if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

mongoose.connect(mongoUri, connectionOptions)
  .then(() => {
    console.log('Connected to MongoDB');
    try {
      console.log('MongoDB DB name:', mongoose.connection?.db?.databaseName);
      console.log('MongoDB URI in use:', (process.env.MONGODB_URI || '').replace(/:\\w+@/, ':****@'));
    } catch {}
    // Start server only after DB connection
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Environment:', process.env.NODE_ENV || 'development');
      console.log('Frontend URL:', FRONTEND_URL);
      console.log('Backend URL:', `http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      errorLabels: error.errorLabels,
      stack: error.stack
    });
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Add session debug logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('Session user:', req.session.user);
    next();
  });
}
