/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const fs = require('fs/promises'); // Use fs.promises for async file operations
const User = require('../models/User')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import v4 function from uuid for generating UUIDs
const path = require('path');
exports. upload  = multer({
    single : "img",
    storage : multer.memoryStorage(),
    limits : {
        fileSize: 10 * 1024 * 1024, // Adjust the file size limit as needed (10MB in this example)
        fieldSize: 10 * 1024 * 1024, // Adjust the field size limit as needed (10MB in this example)
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload a jpg, jpeg, or png image file'));
      }
      cb(null, true);
    }
  });
  exports.saveTemplate = async (imageBuffer, userId, userData) => {
    const filename = `template-${Date.now()}.png`;
    const destinationDir = `./src/uploads/`;
    const username = userData.username;
    let titleMeta = userData.titleMeta;
    let descriptionMeta = userData.descriptionMeta;
    // name = name + "-template";
    try {
        const existingDirs = await fs.readdir(destinationDir);
        const user = await User.findById(userId);
        const directoryExists = existingDirs.some(dir => dir === user.dirName);
        const dirName = `${username}-${uuidv4()}`;
          // Check if user exists with the exact case
          if (!user) {
              throw new Error('User not found');
          }
  
        // If the directory exists, use it; otherwise, create a new one
        if (!directoryExists) {
                await fs.mkdir(`${destinationDir}${dirName}`, { recursive: true });
                // Assign dirName to the existingUser
                user.dirName = dirName;
                 await user.save();   
        }
        // Check if the directory already exists with the exact case
        const name = username + "-template";
        const existingDir = await fs.readdir(`./src/uploads/${user.dirName}/`);
        const directoryExist = existingDir.some(dir => dir === user.templates.name);

        // If the directory doesn't exist, create it
        if (!directoryExist) {
            await fs.mkdir(`${destinationDir}/${user.dirName}/${name}`, { recursive: true });
            await user.save();
        }
        const imageUrl = filename;
        // Convert titleMeta and descriptionMeta to objects
        titleMeta = JSON.parse(titleMeta);
        descriptionMeta = JSON.parse(descriptionMeta);

        // Query the user document to check the length of templates array
        if (user.templates.property.length < 2) { // Check if the length is less than 2
            // Update user's templates with the new template
            await User.findByIdAndUpdate(userId, {
                $push: {
                    'templates.property': { // Specify the path to the property array
                        imageUrl,
                        titleMeta,
                        descriptionMeta
                    }
                }
            });
            
            console.log("Template saved successfully:", filename);
                // Write image to user directory
        await fs.writeFile(`${destinationDir}/${user.dirName}/${user.username}-template/${filename}`, imageBuffer.buffer);
        } else {
            console.error("Cannot save template: Maximum template limit reached.");
        }
    } catch (err) {
        console.error("Error saving template:", err);
    }
};

  exports.saveAvatar = async (userData) => {
    const imageBuffer = userData.image.buffer;
    const username = userData.username;
    const filename = `user-${username || 'unknown'}--${Date.now()}.png`;
    const destinationDir = `./src/uploads/`;

    try {
        // Check if the directory already exists with the exact case
        const existingDirs = await fs.readdir(destinationDir);
        const existingUser = await User.findOne({ username });
        const directoryExists = existingDirs.some(dir => dir === existingUser.dirName);
        const dirName = `${username}-${uuidv4()}`;
          // Check if user exists with the exact case
          if (!existingUser) {
              throw new Error('User not found');
          }
  
        // If the directory exists, use it; otherwise, create a new one
        if (!directoryExists) {
                await fs.mkdir(`${destinationDir}${dirName}`, { recursive: true });
                // Assign dirName to the existingUser
                existingUser.dirName = dirName;
                 await existingUser.save();   
        }

        // Write image to user directory
        await fs.writeFile(`${destinationDir}${existingUser.dirName}/${filename}`, imageBuffer);
        // Update user's images array
        const updatedUser = await User.findOneAndUpdate(
            { username: existingUser.username },
            { $push: { images: { imageUrl: filename } } },
            { new: true }
        );
        console.log("User avatar saved and updated successfully:", updatedUser);
    } catch (err) {
        console.error("Error saving user avatar:", err);
    }
};
exports.getAllImageUrls = async (username, host) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('User not found');
        }

        // Construct the base URL
        const baseUrl = `http://${host}/${user.dirName}/`;

        // Concatenate base URL with each imageUrl
        const imageUrls = user.images.map(image => `${baseUrl}${image.imageUrl}`);

        return imageUrls;
    } catch (err) {
        console.error("Error retrieving user image URLs:", err);
        throw err; // Re-throw the error to be handled by the caller
    }
};