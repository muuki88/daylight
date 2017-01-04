const connect = require('connect')
  , serveStatic = require('serve-static')
  , http = require('http');

const app    = connect().use('/', serveStatic('build'));
const server = http.createServer(app);
const io     = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log('incoming connection')

  io.sockets.emit('message', 'new member joined');

  socket.emit('news', { hello: 'world' });
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
  hotwords : 'alexa'
});

const detector = new Detector({
  resource: "resources/common.res",
  models: models,
  audioGain: 2.0
});

detector.on('silence', function () {
  // console.log('silence');
});

detector.on('sound', function () {
  // console.log('sound');
});

detector.on('error', function () {
  // console.log('error');
});

detector.on('hotword', function (index, hotword) {
  console.log('hotword', index, hotword);
  io.sockets.emit('message', hotword)
});

const mic = record.start({
  threshold: 0,
  verbose: false
});

mic.pipe(detector);

console.log('server listening...')
server.listen(3050);
