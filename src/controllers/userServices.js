/* eslint-disable no-useless-catch */
const User = require('../models/User');

const userService = {
  // Get user data by ID
  getUserByname: async (username) => {
    try {
      const user = await User.findOne({username});
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userService;
