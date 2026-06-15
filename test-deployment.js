// Test if deployed code is updated
console.log('🔍 Testing deployed code...');

// Check if we can access the current page.jsx logic
fetch('https://www.vhassacademy.com')
  .then(response => response.text())
  .then(html => {
    console.log('✅ Website is accessible');
    
    // Check if the HTML contains any signs of the old code
    if (html.includes('new ApiService') || html.includes('Bt is not a constructor')) {
      console.log('❌ Old code detected - deployment may not be complete');
    } else {
      console.log('✅ No old code detected in HTML');
    }
  })
  .catch(error => {
    console.log('❌ Cannot access website:', error.message);
  });

// Test the API directly
fetch('https://api.vhassacademy.com/api/course/all')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API is working, courses found:', data.courses?.length || 0);
  })
  .catch(error => {
    console.log('❌ API error:', error.message);
  });
