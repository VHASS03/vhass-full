// Test script to check production server routes
const API_BASE = 'https://api.vhassacademy.com';

async function testRoutes() {
  console.log('🧪 Testing production server routes...\n');

  const routesToTest = [
    { path: '/api/course/all', method: 'GET', description: 'Get all courses' },
    { path: '/api/course/test-course-id/phonepe-checkout', method: 'POST', description: 'PhonePe checkout' },
    { path: '/health', method: 'GET', description: 'Health check' },
  ];

  for (const route of routesToTest) {
    try {
      console.log(`🔍 Testing ${route.method} ${route.path} - ${route.description}`);
      
      const options = {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(route.method === 'POST' && {
          body: JSON.stringify({ test: true })
        })
      };

      const response = await fetch(`${API_BASE}${route.path}`, options);
      
      console.log(`  Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`  ✅ Route working`);
      } else if (response.status === 405) {
        console.log(`  ❌ Method Not Allowed - Route exists but method not supported`);
      } else if (response.status === 404) {
        console.log(`  ❌ Not Found - Route doesn't exist`);
      } else {
        console.log(`  ⚠️  Other error: ${response.status}`);
      }
      
      // Try to get response text for debugging
      try {
        const text = await response.text();
        if (text && text.length < 200) {
          console.log(`  Response: ${text}`);
        }
      } catch (e) {
        // Ignore text parsing errors
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Run the test
testRoutes().catch(console.error);
