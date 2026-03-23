const express = require('express');
const musicController = require('../controllers/music.controller');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.get('/', musicController.getLibrary);
router.post('/upload', upload.single('music'), musicController.uploadMusic);
router.post('/albums', upload.array('music') ,musicController.getAlbum);

module.exports = router;