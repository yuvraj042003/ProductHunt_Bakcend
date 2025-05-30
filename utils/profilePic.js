const cloudinary = require('./cloudonary');
const {Readable} = require('stream');


const streamUpload = (buffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto', fetch_format: 'auto', gravity: 'auto' },
        ],
      },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = streamUpload;