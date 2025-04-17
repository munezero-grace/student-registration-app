// Simple script to test the backend API connection
const axios = require('axios');

// Registration request configuration
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// Registration data (matching the expected format)
const data = {
  first_name: "Test",
  last_name: "User",
  email: "test@example.com",
  password: "password123",
  date_of_birth: "2010-01-01"
};

// API call function
async function testRegistrationAPI() {
  try {
    console.log('Attempting to connect to API at http://localhost:4000/api/register');
    console.log('Request data:', data);
    
    const response = await axios.post('http://localhost:4000/api/register', data, config);
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error:');
    
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('- Status:', error.response.status);
      console.error('- Data:', error.response.data);
      console.error('- Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('- No response received');
      console.error('- Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('- Error message:', error.message);
    }
    
    return { success: false, error };
  }
}

// Run the test
console.log('===============================');
console.log('TESTING REGISTRATION API');
console.log('===============================');

testRegistrationAPI()
  .then(result => {
    if (result.success) {
      console.log('\n✅ API TEST SUCCESSFUL');
    } else {
      console.log('\n❌ API TEST FAILED');
    }
  })
  .catch(err => {
    console.error('\n❌ TEST EXECUTION ERROR:', err);
  })
  .finally(() => {
    console.log('===============================');
  });
