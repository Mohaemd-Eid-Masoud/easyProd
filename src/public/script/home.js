/* eslint-disable no-unused-vars */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const titleText = document.getElementById('titleInput');
const descriptionText = document.getElementById('descriptionInput');
const templatePreview1 = document.getElementById('templatePreview1');
const templatePreview2 = document.getElementById('templatePreview2');

var selectedTemplate;
const image = {
    x: 0,
    y: 0,
    width: canvas.width, // Set image width to canvas width
    height: canvas.height, // Set image height to canvas height
    img: null
};

// Function to handle image upload
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        image.img = new Image();
        image.img.onload = function() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw image onto canvas
            ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
            // Call function to draw text
            drawText();
        };
        image.img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Event listener for template preview 1
templatePreview1.addEventListener('click', function() {
    applyTemplate(templatePreview1.src);
    selectedTemplate = templatePreview1.src;
});

// Event listener for template preview 2
templatePreview2.addEventListener('click', function() {
    applyTemplate(templatePreview2.src);
    selectedTemplate = templatePreview2.src;
});

// Function to apply selected template// Function to apply selected template
function applyTemplate(templateSrc) {
    const templateImg = new Image();
    templateImg.onload = function() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image onto canvas
        ctx.drawImage(image.img, image.x, image.y, image.width, image.height);
        // Draw template onto canvas
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
        drawText(); // Redraw text
    };
    templateImg.src = templateSrc;
}

function drawText() {
    const property = JSON.parse(sessionStorage.getItem('userTemplatesMeta'));
    const template = JSON.parse(sessionStorage.getItem('templates'));
    // Loop through each template's metadata
    for (let i = 0; i < property.property.length; i++) {
        if (selectedTemplate === template[i]) {
            const templateProperties = property.property[i];

            // Set font properties for title text
            ctx.font = `${templateProperties.titleMeta.fontSize}px ${templateProperties.titleMeta.fontFamily || 'Arial'}`;
            ctx.fillStyle = templateProperties.titleMeta.textColor;
            ctx.fontWeight = templateProperties.titleMeta.fontWeight;

            // Calculate the width of the title text
            const titleWidth = ctx.measureText(titleText.value).width;

            // Draw title text
            ctx.fillText(titleText.value, canvas.width - templateProperties.titleMeta.x_position - titleWidth, templateProperties.titleMeta.y_position);

            // Set font properties for description text
            ctx.font = `${templateProperties.descriptionMeta.fontSize}px ${templateProperties.descriptionMeta.fontFamily || 'Arial'}`;
            ctx.fillStyle = templateProperties.descriptionMeta.textColor;
            ctx.fontWeight = templateProperties.descriptionMeta.fontWeight;

            // Calculate the available space for description text
            const availableHeight = canvas.height - image.height - image.y;

            // Splitting description text into multiple lines
            const descriptionLines = descriptionText.value.split('\n');
            let totalHeight = descriptionLines.length * (templateProperties.descriptionMeta.fontSize + 5);
            
            // Draw each line of description text
            let yPosition = templateProperties.descriptionMeta.y_position;
            if (totalHeight > availableHeight) {
                // If the total height of the description exceeds the available space, draw from the top
                yPosition = templateProperties.descriptionMeta.y_position;
            } else {
                // Otherwise, draw below the image
                yPosition = image.height + image.y + templateProperties.descriptionMeta.fontSize + 5;
            }

            for (let j = 0; j < descriptionLines.length; j++) {
                // Calculate the width of each line of description text
                const descriptionLineWidth = ctx.measureText(descriptionLines[j]).width;

                // Draw each line of description text
                ctx.fillText(descriptionLines[j], canvas.width - templateProperties.descriptionMeta.x_position - descriptionLineWidth, yPosition);
                yPosition += templateProperties.descriptionMeta.fontSize + 5; // Adjust line spacing
            }
        }
    }
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// Assuming there's a button with id "deleteButton" in your HTML
const deleteButton = document.getElementById('deleteButton');

// Event listener for delete button
deleteButton.addEventListener('click', function() {
    clearCanvas(); // Clear the canvas
});

// Redraw only the text
function redrawText() {
    drawText(); // Draw text
}

// Redraw the canvas with both image, template, and text
function redrawCanvas() {
    applyTemplate(selectedTemplate); // Redraw template
    drawText(); // Redraw text
}

titleText.addEventListener('input', function() {
   redrawCanvas(); // Redraw only the text
});

descriptionText.addEventListener('input', function() {
    redrawCanvas(); // Redraw only the text
});

document.querySelector('.arrow-up').addEventListener('click', function() {
    image.y -= 20;
    redrawCanvas(); // Redraw canvas with image and text
});

document.querySelector('.arrow-down').addEventListener('click', function() {
    image.y += 20;
    redrawCanvas(); // Redraw canvas with image and text
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    var titleInput = document.getElementById("titleInput");
    var descriptionInput = document.getElementById("descriptionInput");
    
    titleInput.addEventListener("input", function() {
      if (this.value.length > 30) {
        this.value = this.value.slice(0, 30);
      }
    });
    
    descriptionInput.addEventListener("input", function() {
      if (this.value.length > 120) {
        this.value = this.value.slice(0, 120);
      }
    });
  });
  const saveButton = document.getElementById('saveButton');

  saveButton.addEventListener('click', async () => {
      // Check if a template is selected
      if (!selectedTemplate) {
          alert("Please select a template.");
          return; // Stop execution if no template is selected
      }
  
      // Check if an image is uploaded
      if (!image.img) {
          alert("Please upload an image.");
          return; // Stop execution if no image is uploaded
      }
  
      // Check if title and description are provided
      if (titleText.value.trim() === '' || descriptionText.value.trim() === '') {
          alert("Please enter title and description.");
          return; // Stop execution if title or description is not provided
      }
  
      // Check if title exceeds the character limit
      if (titleText.value.length > 30) {
          alert("Title cannot exceed 30 characters.");
          return; // Stop execution if title exceeds the character limit
      }
  
      // Check if description exceeds the character limit
      if (descriptionText.value.length > 120) {
          alert("Description cannot exceed 120 characters.");
          return; // Stop execution if description exceeds the character limit
      }
  
      // Proceed with saving the canvas
      const canvasDataUrl = canvas.toDataURL('image/png', 1.0); // Convert canvas to PNG data URL with quality 1 (highest)
      const pngBlob = await dataURLToBlob(canvasDataUrl); // Convert data URL to Blob
      const username = JSON.parse(sessionStorage.getItem('username'));
      const formData = new FormData();
      formData.append('img', pngBlob, 'image.png'); // Append Blob to FormData
      formData.append('username', username);
  
      const response = await fetch('/user/upload', {
          method: 'POST',
          body: formData,
      });
  
      if (!response.ok) {
          const errorData = await response.json();
          console.log(formData);
          console.log(errorData);
          throw new Error(errorData.message || 'Failed to upload image');
      }
  
      const responseData = await response.json();
      return responseData;
  });
   function dataURLToBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
}
  // Function to handle logout
  function logout() {
    // Clear session storage
    sessionStorage.clear();
    // Redirect to the login page and clear history
    window.location.replace('/'); // Update with your login page URL
  }
  function displayTemplates ()  { 
    const data = JSON.parse(sessionStorage.getItem('templates'));
    const templatePreview1 = document.getElementById('templatePreview1');
    const templatePreview2 = document.getElementById('templatePreview2');
    if(data[0]) templatePreview1.src =  data[0];
    if(data[1]) templatePreview2.src =  data[1];
  }
displayTemplates();