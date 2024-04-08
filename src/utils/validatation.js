const validateRegistrationData = (data) => {
    const { username, password } = data;
    const errors = {};
  
    if (!username || username.trim() === '') {
      errors.username = 'Username is required';
    }
  
    if (!password || password.trim() === '') {
      errors.password = 'Password is required';
    }
  
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  // Validate image upload data
  const validateImageUploadData = (data) => {
    const {  image } = data;
    const errors = {};
  
    if (!image) {
      errors.file = 'Image file is required';
    } 
  

  
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
 
  
  module.exports = { validateRegistrationData, validateImageUploadData };
  