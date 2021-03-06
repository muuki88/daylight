const express = require('express')
  , path = require('path')
  , http = require('http');

const app    = express()
  .use('/', express.static(__dirname + '/dist'))
  .get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });

const server = http.createServer(app);
const io     = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
  console.log('incoming connection')

  socket.on('wakeup', () => {
    io.sockets.emit('wakeup', {hotword: null})
  });

  socket.on('message', (data) => {

    if (data === 'wakeup') {
      io.sockets.emit('wakeup', {hotword: null})
    } else if (data === 'reload' || data === 'refresh') {
      io.sockets.emit('reload', {})
    } else {
      // socket.emit('message', `received: ${data}`)
      io.sockets.emit('text', data);
    }
  });
});

// snowboy wake word detection
const record = require('node-record-lpcm16');
const snowboy = require('snowboy');
const Detector = snowboy.Detector;
const Models = snowboy.Models;

const models = new Models();

models.add({
  file: 'resources/alexa.umdl',
  sensitivity: '0.5',
  hotwords: 'alexa'
});

models.add({
  file: 'resources/Hey_Wally.pmdl',
  sensitivity: '0.5',
  hotwords: 'hey wally'
});

const detector = new Detector({
  resource: 'resources/common.res',
  models: models,
  audioGain: 2.0
});

detector.on('silence', () => {
  // console.log('silence');
});

detector.on('sound', () => {
  // console.log('sound');
});

detector.on('error', () => {
  // console.log('error');
});

detector.on('hotword', (index, hotword) => {
  console.log(`hotword detected: ${hotword}`)
  io.sockets.emit('wakeup', {
    hotword: hotword
  });
});

const mic = record.start({
  threshold: 0,
  verbose: false
});

mic.pipe(detector);

console.log('server listening...')
server.listen(3050);
