const fs = require('fs');
const path = require('path');

// Clean up temporary files in uploads directory
function cleanupUploads() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('Uploads directory does not exist');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  let cleanedCount = 0;

  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    
    // Delete files older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    if (stats.mtime.getTime() < oneHourAgo) {
      try {
        fs.unlinkSync(filePath);
        cleanedCount++;
        console.log(`Deleted: ${file}`);
      } catch (error) {
        console.error(`Error deleting ${file}:`, error.message);
      }
    }
  });

  console.log(`Cleanup completed. Deleted ${cleanedCount} files.`);
}

// Run cleanup
cleanupUploads();

