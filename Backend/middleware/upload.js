const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'uploads', req.user.id);
      
      // Create the directory if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
  
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const upload = multer({ storage: storage });

module.exports = upload;
