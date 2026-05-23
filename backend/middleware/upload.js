const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed. Images only.`), false);
  }
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// For routes that save files locally
const upload = multer({ storage: diskStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// For routes that stream files directly to Cloudinary (needs buffer in memory)
const memoryUpload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { upload, memoryUpload };
