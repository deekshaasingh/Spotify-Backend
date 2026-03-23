const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../services/storage.service'); // Only one import!

async function uploadMusic(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You do not have the access to create music!"
            });
        }

        // Check if file exists to prevent "buffer of undefined" error
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { title } = req.body;
        const fileBuffer = req.file.buffer;

        // Call the service function
        const result = await uploadFile(fileBuffer.toString('base64'));

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        });

        res.status(201).json({
            message: "Music created successfully!",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        
        // Differentiate between Auth errors and Server errors
        const status = error.name === 'JsonWebTokenError' ? 401 : 500;
        const msg = error.name === 'JsonWebTokenError' ? "Invalid or expired token!" : error.message;

        return res.status(status).json({ message: msg });
    }
}

module.exports = { uploadMusic };