// Detailed CORS Test
const API_URL = 'https://api.vhassacademy.com';

console.log('🔍 Detailed CORS Test...');
console.log('API URL:', API_URL);

// Test 1: Basic GET request
async function testBasicRequest() {
  try {
    console.log('\n📡 Test 1: Basic GET request');
    const response = await fetch(`${API_URL}/api/health`);
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Basic request successful:', data);
    } else {
      console.log('❌ Basic request failed');
    }
  } catch (error) {
    console.log('❌ Basic request error:', error.message);
  }
}

// Test 2: OPTIONS request with detailed logging
async function testOptionsRequest() {
  try {
    console.log('\n📡 Test 2: OPTIONS request');
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.vhassacademy.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('All Headers:', Object.fromEntries(response.headers.entries()));
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
    };
    
    console.log('🔍 CORS Headers:', corsHeaders);
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ OPTIONS request successful');
    } else {
      console.log('❌ OPTIONS request failed');
      
      // Try to get response body for error details
      try {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
      } catch (e) {
        console.log('Could not read error response body');
      }
    }
  } catch (error) {
    console.log('❌ OPTIONS request error:', error.message);
  }
}

// Test 3: Test with different origin
async function testDifferentOrigin() {
  try {
    console.log('\n📡 Test 3: OPTIONS with different origin');
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://vhassacademy.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Origin Header:', response.headers.get('Access-Control-Allow-Origin'));
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ OPTIONS request with different origin successful');
    } else {
      console.log('❌ OPTIONS request with different origin failed');
    }
  } catch (error) {
    console.log('❌ OPTIONS request with different origin error:', error.message);
  }
}

// Test 4: Test root path
async function testRootPath() {
  try {
    console.log('\n📡 Test 4: OPTIONS request to root path');
    const response = await fetch(`${API_URL}/`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://www.vhassacademy.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Origin Header:', response.headers.get('Access-Control-Allow-Origin'));
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ OPTIONS request to root successful');
    } else {
      console.log('❌ OPTIONS request to root failed');
    }
  } catch (error) {
    console.log('❌ OPTIONS request to root error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testBasicRequest();
  await testOptionsRequest();
  await testDifferentOrigin();
  await testRootPath();
}

runAllTests();
