const multer = require('multer');
const path = require('path');
const fs = require('fs');

// // Define storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/' + req.user.id + '/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

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
