import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ApiService from '../services/api.js';

export default function PhonePeTest() {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testPhonePeConfig = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/phonepe/test', {
        credentials: 'include'
      });
      const data = await response.json();
      setTestResult(data);
      console.log('PhonePe test result:', data);
    } catch (error) {
      console.error('PhonePe test error:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">PhonePe Configuration Test</h2>
      
      <button
        onClick={testPhonePeConfig}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test PhonePe Configuration'}
      </button>

      {testResult && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">
            Test Result: {testResult.success ? '✅ Success' : '❌ Failed'}
          </h3>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
