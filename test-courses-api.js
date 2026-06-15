// Test Courses API
const API_URL = 'https://api.vhassacademy.com';

console.log('🔍 Testing Courses API...');
console.log('API URL:', API_URL);

// Test 1: Basic courses API call
async function testCoursesAPI() {
  try {
    console.log('\n📡 Test 1: Fetching courses from API');
    const response = await fetch(`${API_URL}/api/course/all`);
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Courses API successful');
      console.log('Number of courses:', data.courses?.length || 0);
      
      if (data.courses && data.courses.length > 0) {
        console.log('Sample course:', {
          title: data.courses[0].title,
          instructor: data.courses[0].createdBy,
          price: data.courses[0].price,
          image: data.courses[0].image
        });
      } else {
        console.log('⚠️ No courses found in the database');
      }
    } else {
      console.log('❌ Courses API failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Courses API error:', error.message);
  }
}

// Test 2: Test with CORS headers
async function testCoursesWithCORS() {
  try {
    console.log('\n📡 Test 2: Fetching courses with CORS headers');
    const response = await fetch(`${API_URL}/api/course/all`, {
      headers: {
        'Origin': 'https://www.vhassacademy.com',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('CORS Origin:', response.headers.get('Access-Control-Allow-Origin'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Courses API with CORS successful');
      console.log('Number of courses:', data.courses?.length || 0);
    } else {
      console.log('❌ Courses API with CORS failed');
    }
  } catch (error) {
    console.log('❌ Courses API with CORS error:', error.message);
  }
}

// Test 3: Test admin courses API (to compare)
async function testAdminCoursesAPI() {
  try {
    console.log('\n📡 Test 3: Fetching admin courses API');
    const response = await fetch(`${API_URL}/api/admin/courses`);
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin courses API successful');
      console.log('Number of admin courses:', data.courses?.length || 0);
    } else {
      console.log('❌ Admin courses API failed');
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Admin courses API error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testCoursesAPI();
  await testCoursesWithCORS();
  await testAdminCoursesAPI();
}

runAllTests();
