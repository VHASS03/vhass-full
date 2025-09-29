import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import ApiService from '../services/api.js';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { transactionId } = useParams(); // Get transactionId from URL params
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const merchantTransactionId = searchParams.get('merchantTransactionId') || transactionId;
        const phonepeTransactionId = searchParams.get('transactionId');
        const code = searchParams.get('code');
        const type = searchParams.get('type'); // course or workshop

        console.log('Payment callback params:', { 
          merchantTransactionId, 
          phonepeTransactionId, 
          code, 
          type,
          urlTransactionId: transactionId 
        });

        if (!merchantTransactionId) {
          setPaymentStatus('error');
          setPaymentDetails({
            message: 'No transaction ID found in URL or parameters'
          });
          return;
        }

        // Check payment status with backend API
        const statusResponse = await ApiService.phonepeStatus(type || 'course', merchantTransactionId);
        
        console.log('Payment status response:', statusResponse);
        
        if (statusResponse.status === 'SUCCESS') {
          setPaymentStatus('success');
          setPaymentDetails({
            transactionId: statusResponse.txnid,
            merchantOrderId: statusResponse.merchantOrderId,
            status: 'COMPLETED',
            message: 'Course enrollment successful!'
          });
          
          // Also try to fix any missing enrollments
          try {
            await ApiService.fixEnrollment();
            console.log('Enrollment fix completed');
          } catch (error) {
            console.error('Enrollment fix failed:', error);
          }
          
          // Auto-redirect to dashboard after 3 seconds with countdown
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/dashboard');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
        } else if (statusResponse.status === 'FAILURE') {
          setPaymentStatus('failed');
          setPaymentDetails({
            transactionId: statusResponse.merchantOrderId,
            status: 'FAILED',
            message: 'Payment failed. Please try again.'
          });
        } else if (statusResponse.status === 'PENDING') {
          setPaymentStatus('processing');
          setPaymentDetails({
            transactionId: statusResponse.merchantOrderId,
            status: 'PENDING',
            message: 'Payment is still being processed.'
          });
        } else {
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setPaymentStatus('error');
        setPaymentDetails({
          message: 'An error occurred while processing your payment.'
        });
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate, transactionId]);

  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return {
          icon: <Loader className="w-16 h-16 animate-spin text-blue-500" />,
          title: 'Processing Payment...',
          message: 'Please wait while we verify your payment.',
          color: 'text-blue-500'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful!',
          message: `Your course has been enrolled! Redirecting to dashboard in ${countdown} seconds...`,
          color: 'text-green-500'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          message: 'Your payment was not successful. Please try again.',
          color: 'text-red-500'
        };
      case 'error':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Error',
          message: 'An error occurred while processing your payment.',
          color: 'text-red-500'
        };
      default:
        return {
          icon: <Loader className="w-16 h-16 animate-spin text-blue-500" />,
          title: 'Processing...',
          message: 'Please wait.',
          color: 'text-blue-500'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500 text-center">
        <div className="mb-6">
          {statusContent.icon}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${statusContent.color}`}>
          {statusContent.title}
        </h1>
        
        <p className="text-gray-300 mb-6">
          {statusContent.message}
        </p>

        {paymentDetails && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">Payment Details:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
              {paymentDetails.merchantOrderId && (
                <p><strong>Order ID:</strong> {paymentDetails.merchantOrderId}</p>
              )}
              <p><strong>Status:</strong> {paymentDetails.status}</p>
              {paymentDetails.message && (
                <p><strong>Message:</strong> {paymentDetails.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {paymentStatus === 'success' ? 'View My Courses' : 'Go to Dashboard'}
          </button>
          
          {paymentStatus === 'failed' && (
            <button
              onClick={() => navigate('/course')}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
