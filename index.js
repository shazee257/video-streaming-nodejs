const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) res.status(400).send("Requires Range header");

    const videoPath = __dirname + '/BigBuckBunny_512kb.mp4';
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': (end - start) + 1,
        'Content-Type': 'video/mp4'
    }

    res.writeHead(206, headers);

    // Stream video file
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

