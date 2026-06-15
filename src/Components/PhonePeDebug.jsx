import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function PhonePeDebug() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testPhonePeConfig = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      // Test the configuration endpoint
      const configResponse = await fetch('/api/phonepe/test', {
        credentials: 'include'
      });
      const configData = await configResponse.json();
      
      console.log('PhonePe Config Test:', configData);
      
      // Test a simple payment initiation
      const testPayload = {
        merchantId: 'SU2505141931362838820920',
        merchantTransactionId: 'TEST_' + Date.now(),
        amount: 100, // 1 rupee in paise
        redirectUrl: 'http://localhost:5173/payment/callback',
        redirectMode: 'REDIRECT',
        callbackUrl: 'http://localhost:5173/payment/callback',
        merchantUserId: user._id,
        mobileNumber: '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64 = btoa(JSON.stringify(testPayload));
      const saltKey = '33418406-0957-4ae0-a07a-a6383760ba05';
      const saltIndex = '1';
      const string = `${base64}/pg/v1/pay${saltKey}`;
      
      // Use crypto-js for SHA256
      const CryptoJS = await import('crypto-js');
      const sha256 = CryptoJS.SHA256(string).toString();
      const xVerify = `${sha256}###${saltIndex}`;

      const paymentResponse = await fetch('/api/phonepe/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          request: base64,
          xVerify: xVerify,
          payload: testPayload
        })
      });

      const paymentData = await paymentResponse.json();
      
      console.log('PhonePe Payment Test:', paymentData);
      
      setDebugInfo({
        config: configData,
        payment: paymentData,
        testPayload,
        base64,
        xVerify,
        string
      });

    } catch (error) {
      console.error('PhonePe debug error:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">PhonePe Debug Tool</h2>
      
      <button
        onClick={testPhonePeConfig}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
      >
        {loading ? 'Testing...' : 'Test PhonePe Configuration'}
      </button>

      {debugInfo && (
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">Configuration Test Result:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.config, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">Payment Test Result:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.payment, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">Test Payload:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo.testPayload, null, 2)}
            </pre>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-bold mb-2">Generated Values:</h3>
            <div className="space-y-2">
              <div><strong>Base64:</strong> <code className="bg-gray-200 px-1 rounded">{debugInfo.base64}</code></div>
              <div><strong>X-VERIFY:</strong> <code className="bg-gray-200 px-1 rounded">{debugInfo.xVerify}</code></div>
              <div><strong>String to Hash:</strong> <code className="bg-gray-200 px-1 rounded text-xs">{debugInfo.string}</code></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
