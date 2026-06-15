// Test API Configuration
const API_URL = 'https://api.vhassacademy.com';

console.log('🔍 Testing API Configuration...');
console.log('API URL:', API_URL);

// Test basic connectivity
async function testAPI() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API is accessible:', data);
    } else {
      console.log('❌ API returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ API connection failed:', error.message);
  }
}

// Test CORS preflight
async function testCORS() {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.vhassacademy.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    };
    
    console.log('🔍 CORS Headers:', corsHeaders);
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ CORS preflight successful');
    } else {
      console.log('❌ CORS preflight failed:', response.status);
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
}

// Run tests
testAPI();
testCORS();
