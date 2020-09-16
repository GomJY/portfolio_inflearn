const fs = require('fs');

function main() {
  isUploadSetting();
}

function isUploadSetting() {
  !fs.existsSync('upload') && fs.mkdirSync('upload');
  !fs.existsSync('upload/video') && fs.mkdirSync('upload/video');
}

module.exports = main;