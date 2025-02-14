var croppedImage = null;
var fileName = '';

// Setting Placeholder Banner in Canvas 
const canvas = document.getElementById('downloadCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 630;

const background = new Image();
background.src = './img/aws-community-day-2025-pakistan.jpg';

background.onload = function () {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// setting user icon in placeholder preview area 
document.getElementById('previewImage').src = './img/user-icon.png';

// jQuery logic for uploading and cropping image
$(document).ready(function () {
    let cropper; // Store cropper instance

    // Handle image upload and initialize cropper
    $('#imageUpload').change(function (event) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Display image to crop
            $('#imageToCrop').attr('src', e.target.result);
            $('#cropperContainer').show();
            $('#imagePreview').hide();


            // Initialize cropper after image is loaded
            if (cropper) {
                cropper.destroy(); // Destroy previous instance (if any)
            }

            cropper = new Cropper(document.getElementById('imageToCrop'), {
                aspectRatio: 1, // Square crop for the headshot
                viewMode: 1,    // Restrict the image to be within the container
                autoCropArea: 0.8, // Set crop area to be 80% of the image size
                scalable: false,  // Disable scaling
                zoomable: false,  // Disable zooming
                cropBoxResizable: false, // Prevent resizing the crop box
                background: true,
            });
        };
        reader.readAsDataURL(event.target.files[0]);
        fileName = event.target.files[0].name;
    });

    // Handle cropping the image when the user clicks 'Crop Image'
    $('#cropImageBtn').click(function () {
        const canvas = cropper.getCroppedCanvas({
            width: 180,  // Set desired size for headshot
            height: 180
        });

        // Convert the cropped image to base64 format
        croppedImage = canvas.toDataURL('image/png');
        $('#imagePreview').show();
        $('#previewImage').attr('src', croppedImage).show();

        // Hide cropper and reset the form
        $('#cropperContainer').hide();
        $('#imageUpload').val(''); // Reset the file input
    });
});

// Generate Banner Capability
function generateBanner() {
    console.log(croppedImage);

    const canvas = document.getElementById('downloadCanvas');
    const ctx = canvas.getContext('2d');

    // Set fixed canvas dimensions
    canvas.width = 1200;
    canvas.height = 630;

    // Load background image
    const background = new Image();
    background.src = './img/aws-community-day-2025-pakistan.jpg';

    background.onload = function () {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        if (croppedImage) {
            const img = new Image();
            img.src = croppedImage;

            img.onload = function () {
                const headshotSize = 180; // Adjust size
                const x = 60;
                const y = (canvas.height - headshotSize) / 2;

                // Draw Circular Headshot
                ctx.save();
                ctx.beginPath();
                ctx.arc(x + headshotSize / 2, y + headshotSize / 2, headshotSize / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, x, y, headshotSize, headshotSize);
                ctx.restore();

                // Get User Inputs
                const name = document.getElementById('nameInput').value || 'Your Name';
                const designation = document.getElementById('designationInput').value || 'Your Title';
                const company = document.getElementById('companyInput').value || 'Your Company';

                function drawText(text, x, y, fontSize, fontWeight = 'bold') {
                    ctx.font = `${fontWeight} ${fontSize}px Arial`;
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'left';
                    ctx.fillText(text, x, y);
                }

                // Positioning
                const textX = x + headshotSize + 30;
                const textY = y + headshotSize / 2 - 20;

                // Name (Larger)
                drawText(name, textX, textY, 50, 'bold');

                // Designation (Closer to name)
                drawText(designation, textX, textY + 40, 30, 'normal');

                // Company (Even Closer)
                drawText(company, textX, textY + 80, 25, 'normal');

                // Trigger download
                triggerDownload(canvas, name);
            };
        }
    };

    background.onerror = function () {
        alert('Error loading banner background. Ensure the image exists in the correct path.');
    };
}

// Function to trigger download
function triggerDownload(canvas, name) {
    setTimeout(() => {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = `${name.replace(/\s/g, '_')}_aws_banner.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }, 500); // Adding slight delay to ensure rendering
}