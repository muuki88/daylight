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

io.sockets.on('connection', function (socket) {
  console.log('incoming connection')

  io.sockets.emit('message', 'new member joined');

  socket.on('message', function (data) {
    console.log('message', data);
    socket.emit('message', { hello: 'world'})
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
