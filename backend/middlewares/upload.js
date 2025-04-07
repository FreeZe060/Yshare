const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const generateStorage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'media', folderName);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const profileStorage = generateStorage('profile-images');
const eventStorage = generateStorage('event-images');
const newsStorage = generateStorage('news-images');

const profileUpload = multer({ storage: profileStorage, fileFilter });
const eventUpload = multer({ storage: eventStorage, fileFilter });
const newsUpload = multer({ storage: newsStorage, fileFilter });

module.exports = {
  profileUpload,
  eventUpload,
  newsUpload
};