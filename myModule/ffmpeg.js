const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const mp4_to_hls = async (fileName) => {
  // let filePath = path.join(__dirname, ".." , `/upload/video/${fileName}.mp4`);
  // console.log(filePath);
  return new Promise((res, rej) => {
    ffmpeg(fs.createReadStream(path.join(__dirname, "../upload/video/", fileName+".mp4",)), { timeout: (60 * 60 * 60) }).addOptions([
      '-profile:v baseline',
      '-level 3.0',
      '-start_number 0',  //지정된 번호부터 목록이  시작된다.
      '-hls_time 30',     //세그먼트 길이
      '-hls_list_size 0', //HLS 세그먼트 사이즈
      '-f hls'
    ]).output(`upload/hls/${fileName}.m3u8`)
    .on('end', () => {
      res({code: 200, message: `${fileName}파일 변환 완료`});
    }).on('error', (err, status, stderr) => {
      console.error(fileName, "!!! Error");
      rej({err, status});
    }).run();
  });
}


module.exports = {mp4_to_hls};