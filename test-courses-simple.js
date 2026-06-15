// Simple Courses Test
const API_URL = 'https://api.vhassacademy.com';

console.log('🔍 Testing Courses API...');

async function testCourses() {
  try {
    console.log('📡 Fetching courses...');
    const response = await fetch(`${API_URL}/api/course/all`);
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Courses API working!');
      console.log('Number of courses:', data.courses?.length || 0);
      
      if (data.courses && data.courses.length > 0) {
        console.log('First course:', data.courses[0].title);
      }
    } else {
      console.log('❌ Courses API failed');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCourses();
