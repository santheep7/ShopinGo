const multer = require('multer');

// Use memory storage to store file buffer in RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;