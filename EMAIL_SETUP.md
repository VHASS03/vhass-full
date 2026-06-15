# Email Setup Guide for Payment Notifications

This guide will help you set up email notifications for payment success using Nodemailer with Gmail.

## 🔧 Email Configuration

### 1. Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account (vhass0310@gmail.com)
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Update your `backend/config.env` file with the following email configuration:

```env
# Email Configuration (for password reset and payment notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=vhass0310@gmail.com
SMTP_PASS=your-app-password-here
Gmail=vhass0310@gmail.com
Password=your-app-password-here
```

**Replace `your-app-password-here` with the actual 16-character app password from step 1.**

## 📧 Email Notifications

### Payment Success Flow

When a payment is successful, the system will send emails to:

1. **Admin Email** (vhass0310@gmail.com):
   - Customer name
   - Customer email
   - Course/Workshop name
   - Transaction ID
   - Payment status
   - Date & time

2. **Customer Email**:
   - Confirmation of successful purchase
   - Transaction details
   - Welcome message

### Email Templates

The system uses two email templates:

1. **Admin Notification** (`sendTransactMailAdmin`):
   - Sent to vhass0310@gmail.com
   - Includes all transaction details
   - Professional business template

2. **Customer Confirmation** (`sendTransactMailUser`):
   - Sent to customer's email
   - Confirmation message
   - Transaction details
   - VHASS branding

## 🚀 Implementation Status

### ✅ Completed Features

- **Course Payments**: Email notifications for course purchases
- **Workshop Payments**: Email notifications for workshop registrations
- **Admin Notifications**: All payment details sent to vhass0310@gmail.com
- **Customer Confirmations**: Success/failure emails to customers
- **Transaction Tracking**: Complete payment status handling

### 📋 Email Content

**Admin Email Includes:**
- Customer name and email
- Course/Workshop name
- Transaction ID
- Payment status (COMPLETED/FAILED)
- Date and time of transaction

**Customer Email Includes:**
- Personalized greeting
- Course/Workshop name
- Transaction ID
- Payment status
- Date and time
- VHASS contact information

## 🔍 Testing

### Test Payment Flow

1. **Start a test payment** on any course or workshop
2. **Complete the payment** through PhonePe
3. **Check emails**:
   - Admin email (vhass0310@gmail.com) should receive notification
   - Customer email should receive confirmation

### Troubleshooting

**If emails are not being sent:**

1. **Check Gmail credentials**:
   - Verify app password is correct
   - Ensure 2FA is enabled
   - Check if Gmail account allows less secure apps

2. **Check environment variables**:
   - Verify Gmail and Password are set correctly
   - Restart the backend server after changes

3. **Check server logs**:
   - Look for email transport errors
   - Verify SMTP connection

## 📞 Support

If you encounter any issues with email setup:

1. **Gmail Issues**: Contact Google support for app password problems
2. **Technical Issues**: Check server logs for detailed error messages
3. **Configuration**: Verify all environment variables are set correctly

## 🔒 Security Notes

- **Never commit app passwords** to version control
- **Use environment variables** for all sensitive data
- **Regularly rotate app passwords** for security
- **Monitor email logs** for any suspicious activity

---

**Next Steps:**
1. Set up Gmail app password
2. Update config.env with correct credentials
3. Test payment flow
4. Monitor email delivery

Your payment notification system is now ready! 🎉
