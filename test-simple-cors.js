// Simple CORS Test
const API_URL = 'https://api.vhassacademy.com';

console.log('🔍 Simple CORS Test...');

// Test OPTIONS request
async function testCORS() {
  try {
    console.log('📡 Testing OPTIONS request...');
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.vhassacademy.com'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('CORS Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('CORS Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ CORS preflight successful!');
    } else {
      console.log('❌ CORS preflight failed');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCORS();
