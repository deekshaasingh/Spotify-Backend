const ImageKit = require('@imagekit/nodejs');

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function uploadFile(fileBufferString) { // Changed parameter name for clarity
    const result = await imagekit.files.upload({
        file: fileBufferString, // This must match the variable passed in
        fileName: "music-" + Date.now(),
        folder: "all-music/music"
    });

    return result;
}

module.exports = {uploadFile};