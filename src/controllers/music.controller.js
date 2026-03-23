const userModel = require('../models/user.model');
const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../services/storage.service'); 

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

async function getAlbum(req, res){
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized!" });
    }

    let decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You do not have the access to create music!"
            });
        }

        const {title, musicIDs} = req.body;

        const album = await albumModel.create({
            title,
            artist: decoded.id,
            musics: musicIDs
        })

        res.status(201).json({
            message: "Album created successfully!"
        })
    }


    catch(error) {
    console.error("Album Creation Error:", error); // This will tell you EXACTLY what is wrong
    return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    });
}
}

async function getLibrary(req, res) {
    try {
        const songs = await musicModel.find().populate('artist', 'username');
        const albums = await albumModel.find().populate('artist', 'username');

        res.status(200).json({ songs, albums });
    } catch (error) {
        // Look at your VS Code terminal after you see this!
        console.error("DETAILED ERROR:", error); 
        res.status(500).json({ 
            message: "Library Error", 
            error: error.message 
        });
    }
}
module.exports = { uploadMusic , getAlbum, getLibrary};