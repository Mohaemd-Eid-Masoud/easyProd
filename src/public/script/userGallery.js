/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function Reload ()  {
        const token = sessionStorage.getItem('token');
if (!token) {
    // Handle case when token is not available (user not logged in)
    return Promise.reject('No token available');
}
     const redirectURL = sessionStorage.setItem('redirectURL', '/adminDashboard');
return fetch(redirectURL, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}` // Include the token in the Authorization header
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text(); // Parse response body as JSON
})
.then(html => {
    // Erase current document content and replace with HTML response
    document.open();
    document.write(html);
    document.close();
})
.catch(error => {
    console.error('Error:', error);
    // Handle error
});}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const titleText = document.getElementById('titleText');
const descriptionText = document.getElementById('descriptionText');
let img = new Image();

// Function to handle image upload
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.onload = function() {
            if (img.width !== 1080 || img.height !== 1080) {
                alert("Please upload an image with dimensions 1080x1080.");
                return; // Exit the function without further processing
            }
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw image onto canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Call function to draw text
            drawText();
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});
function drawText() {
    // Set font properties for title text
    ctx.font = `${parseInt(document.getElementById('titleFontSize').value)}px ${document.getElementById('titleFontFamily').value}`;
    ctx.fillStyle = document.getElementById('titleColor').value;
    // Handle font weight
    if (document.getElementById('titleFontWeight').value === 'bold') {
        ctx.font = 'bold ' + ctx.font;
    }

    // Calculate the width of the title text
    const titleWidth = ctx.measureText(titleText.value).width;

    // Draw title text at specified position, adjusting for right-to-left rendering
    ctx.fillText(titleText.value, canvas.width - parseInt(document.getElementById('titleX').value) - titleWidth, parseInt(document.getElementById('titleY').value));

    // Set font properties for description text
    ctx.font = `${parseInt(document.getElementById('descriptionFontSize').value)}px ${document.getElementById('descriptionFontFamily').value}`;
    ctx.fillStyle = document.getElementById('descriptionColor').value;
    // Handle font weight
    if (document.getElementById('descriptionFontWeight').value === 'bold') {
        ctx.font = 'bold ' + ctx.font;
    }

    const descriptionX = parseInt(document.getElementById('descriptionX').value);
    const descriptionY = parseInt(document.getElementById('descriptionY').value);
    const descriptionFontSize = parseInt(document.getElementById('descriptionFontSize').value);
    const maxLineWidth = canvas.width - descriptionX; // Maximum width for description text

    // Split description into multiple lines based on maximum width
    let lines = [];
    let line = '';
    descriptionText.value.split('\n').forEach((paragraph) => {
        paragraph.split(' ').forEach((word) => {
            const testLine = line + word + ' ';
            const testLineWidth = ctx.measureText(testLine).width;
            if (testLineWidth > maxLineWidth) {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines.push(line);
        line = '';
    });
    if (line.length > 0) {
        lines.push(line);
    }

    // Reverse the lines for right-to-left rendering
    lines = lines.map(line => line.split('').reverse().join('')).reverse();

    // Draw each line of description text
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width - ctx.measureText(line).width - descriptionX, descriptionY + index * descriptionFontSize);
    });
}


// Add event listeners to form inputs and textarea
document.querySelectorAll('.text-input input, .text-input select, textarea').forEach(input => {
    input.addEventListener('input', () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Call function to draw text
        drawText();
    });
});

// Initial draw when page loads
drawText();
function downloadImage() {
    if (!img) {
        alert('Please upload an image.');
        return;
    }

    // Save canvas as image
    const image = canvas.toDataURL({ format: 'png', quality: 1 });

    // Download the image
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function displayTemplates () {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));   
    const userId = userInfo.user._id;
    const response = await fetch(`/admin/geTemplates/${userId}`);
    const data = await response.json();
    
    const tempalteOne = document.getElementById('templatePreview1');
    const templateTwo = document.getElementById('templatePreview2');
    if(data.templateUrls[0]){    tempalteOne.src = data.templateUrls[0];
    }
    if(data.templateUrls[1]){    templateTwo.src = data.templateUrls[1];
    }
   }
//********************************************************************** */

async function fetchAvatars(username) {
    try {
        const response = await fetch(`/admin/getAvatars?username=${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch avatars');
        }
        
        const data = await response.json();
        return data.avatars;
    } catch (error) {
        console.error('Error fetching avatars:', error.message);
        throw error;
    }
}

// Function to display avatars in the gallery
async function displayAvatars() {
    const galleryPlace = document.querySelector('.gallery-place');
    
    try {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (!userInfo) {
            throw new Error('Username not found in sessionStorage');
        }
        
        const avatars = await fetchAvatars(userInfo);
        
        // Create HTML elements for each avatar and append them to the gallery
        avatars.forEach(avatarUrl => {
            const img = document.createElement('img');
            img.classList.add('gallery'); // Add class 'avatar-image' to the img element
            img.src = avatarUrl;
            img.alt = 'User Avatar';
            galleryPlace.appendChild(img);
        });
    } catch (error) {
        console.error('Failed to display avatars:', error.message);
    }
}
displayAvatars();
displayTemplates();

// Assuming you have two buttons with IDs deleteTemplate1Btn and deleteTemplate2Btn

const deleteTemplate = async (index) => {
    try {
      const username = JSON.parse(sessionStorage.getItem('user')); // Provide the username here
      const user = JSON.parse(sessionStorage.getItem('userInfo')); // Provide the template name here
      const templateId = user.user.templates.property[index];
      const template = user.user.templates.property[index];
      if (template) {
          const imageUrl = template.imageUrl;
      
        const response = await fetch(`/admin/deleteTemplate/${imageUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, templateId })
      });      const data = await response.json();
       console.log(data.json());
    } else {
        console.error('Template at index', index, 'is undefined.');
    }
    }
     catch (error) {
      console.error('Error:', error);
    }
  };
  
  document.getElementById('deleteTemplate1Btn').addEventListener('click', () => {
    deleteTemplate(0);
    const template = document.getElementById('templatePreview1');
    template.alt =   "Template Deleted";
    template.removeAttribute('src');

  });
  
  document.getElementById('deleteTemplate2Btn').addEventListener('click', () => {
    deleteTemplate(1);  
    const template = document.getElementById('templatePreview2');
    template.alt =   "Template Deleted";
    template.removeAttribute('src');
  });
//   onload = function() {
//     const redirectURL = sessionStorage.getItem('redirectURL');
//     if (redirectURL) {
//     fetchProtectedResource(redirectURL);
//     }
// };

  const saveTemplateButton = document.getElementById('saveTemplateButton');
    saveTemplateButton.addEventListener('click' ,async () => {
      // Gather data from HTML elements
      const titleX = document.getElementById('titleX').value;
      const titleY = document.getElementById('titleY').value;
      const titleColor = document.getElementById('titleColor').value;
      const titleFontSize = document.getElementById('titleFontSize').value;
      const titleFontWeight = document.getElementById('titleFontWeight').value;
      const titleFontFamily = document.getElementById('titleFontFamily').value;
    
      const descriptionX = document.getElementById('descriptionX').value;
      const descriptionY = document.getElementById('descriptionY').value;
      const descriptionColor = document.getElementById('descriptionColor').value;
      const descriptionFontSize = document.getElementById('descriptionFontSize').value;
      const descriptionFontWeight = document.getElementById('descriptionFontWeight').value;
      const descriptionFontFamily = document.getElementById('descriptionFontFamily').value;
      // Get userId from userInfo
      // Retrieve user information from sessionStorage
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      // Accessing userId from the nested user object
      const userId = userInfo.user._id;



      const imageInput = document.getElementById('imageInput');
    
      const imageFile = imageInput.files[0];
    
      // Create FormData object to send files and other data
      const formData = new FormData();
      formData.append('username', userInfo.user.username); // Implement this function similarly to getUserId()
      formData.append('titleMeta', JSON.stringify({ x_position: titleX, y_position: titleY, textColor: titleColor, fontSize: titleFontSize, fontWeight: titleFontWeight, fontfamily: titleFontFamily }));
      formData.append('descriptionMeta', JSON.stringify({  x_position: descriptionX, y_position: descriptionY, textColor: descriptionColor, fontSize: descriptionFontSize, fontWeight: descriptionFontWeight, fontfamily: descriptionFontFamily }));
      formData.append('template', imageFile);
      try {
        const response = await fetch(`/admin/${userId}/uploadTemplate`, {
          method: 'POST',
          body: formData,
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log('Template uploaded successfully:', data.message);
          // Perform any additional actions if needed
        window.location.reload();
         } else {
          console.error('Failed to upload template:', data.error);
          // Handle error response
        }
      } catch (error) {
        console.error('Error uploading template:', error);
        // Handle network or other errors
      }  
    }
);
const redirectURL = sessionStorage.getItem('redirectURL');
if ( redirectURL=='/adminDashboard'){
    window.location.reload = 
    Reload() ;
}
document.getElementById("backButton").addEventListener("click", function() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        // Handle case when token is not available (user not logged in)
        return Promise.reject('No token available');
    }
    const redirect = sessionStorage.setItem('redirectURL','/admin');
    return fetch('/admin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}` // Include the token in the Authorization header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Parse response body as JSON
    })
    .then(html => {
        // Erase current document content and replace with HTML response
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => {
        console.error('Error:', error);})
    });