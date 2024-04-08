// Import necessary modules
const User = require('../models/User');

// Define controller functions
const userController = {
  // Upload image with title and description
  uploadImage: async (req, res) => {
    try {
      const { userId } = req.params;
      const { image, title, description } = req.body;
      // Save uploaded image to user's directory (implementation depends on file system management)
      // For simplicity, let's assume the image is saved to a directory
      // Save title and description in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Update user's image data
      user.images.push({ imageUrl: image, title, description });
      await user.save();
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

// Export userController object
module.exports = userController;
