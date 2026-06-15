# VHASS Backend Server

This is the backend server for the VHASS platform, providing APIs for user authentication, course management, workshop management, and payment processing.

## Features

- **User Authentication**: Registration, login, Google OAuth, password reset
- **Course Management**: Course creation, enrollment, progress tracking
- **Workshop Management**: Workshop creation, enrollment
- **Payment Integration**: PhonePe payment gateway
- **File Upload**: Course materials and workshop content
- **Email Services**: Password reset and verification emails

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials (for Google login)
- PhonePe merchant credentials (for payments)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VHASS03/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/vhass_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key-change-this-in-production
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Environment
   NODE_ENV=development
   
   # PhonePe Configuration
   PHONEPE_MERCHANT_ID=your-phonepe-merchant-id
   PHONEPE_MERCHANT_KEY=your-phonepe-merchant-key
   PHONEPE_REDIRECT_URL=http://localhost:5173
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-email-password
   
   # Server Configuration
   PORT=5001
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `POST /api/user/verify` - Email verification
- `POST /api/user/forgot` - Forgot password
- `POST /api/user/reset` - Reset password
- `GET /api/user/me` - Get user profile
- `GET /auth/google` - Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

### Courses
- `GET /api/course/all` - Get all courses
- `GET /api/course/:id` - Get single course
- `POST /api/course/new` - Create new course (admin only)
- `POST /api/course/:id` - Add lectures to course (admin only)
- `DELETE /api/course/:id` - Delete course (admin only)
- `GET /api/lectures/:id` - Get course lectures
- `GET /api/lecture/:id` - Get single lecture
- `GET /api/mycourse` - Get user's enrolled courses
- `POST /api/course/phonepe/checkout/:id` - PhonePe checkout for course
- `POST /api/course/phonepe/status/:merchantOrderId` - PhonePe payment status

### Workshops
- `GET /api/workshop/all` - Get all workshops
- `GET /api/workshop/:id` - Get single workshop
- `POST /api/workshop/new` - Create new workshop (admin only)
- `DELETE /api/workshop/:id` - Delete workshop (admin only)
- `GET /api/myworkshop` - Get user's enrolled workshops
- `POST /api/workshop/phonepe/checkout/:id` - PhonePe checkout for workshop
- `POST /api/workshop/phonepe/status/:transactionId` - PhonePe payment status

### User Progress
- `POST /api/user/progress` - Add user progress
- `GET /api/user/progress` - Get user progress

## Database Models

- **User**: User accounts and authentication
- **Courses**: Course information and content
- **Lectures**: Individual lecture content
- **Workshop**: Workshop information
- **Progress**: User progress tracking
- **Payment**: Payment transaction records
- **Transaction**: PhonePe transaction details

## Middleware

- **isAuth**: Authentication middleware
- **isAdmin**: Admin authorization middleware
- **multer**: File upload middleware

## Deployment

The backend is configured for deployment on Render.com. The `render.yaml` file contains the deployment configuration.

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `SESSION_SECRET`: Secret key for sessions
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FRONTEND_URL`: Production frontend URL
- `NODE_ENV`: Set to "production"
- `PHONEPE_MERCHANT_ID`: PhonePe merchant ID
- `PHONEPE_MERCHANT_KEY`: PhonePe merchant key
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Testing

```bash
# Test database connection
node testConnection.js
```

### File Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── database/        # Database connection
├── middlewares/     # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # File uploads
├── index.js         # Main server file
├── package.json     # Dependencies
└── render.yaml      # Deployment configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software owned by VHASS SOFTWARES PRIVATE LIMITED.