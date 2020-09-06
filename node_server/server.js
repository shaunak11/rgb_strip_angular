//import server setup modules
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//import LED module
var ws281x = require('./node_modules/rpi-ws281x-native/lib/ws281x-native');

//LED setup
var NUM_LEDS = 150;
pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS);

var port = 8000;

var rgb_state = {r:255, g:0, b:0, a:1}

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', (socket) => {

var temp = require("pi-temperature");
temp.measure(function(err, temp) {
    if (err) console.error(err);
    else {
	socket.emit('temp', {
	    msg: temp
	});
    }
});

socket.emit('event2', {
  msg: rgb_state
});


socket.on('event1', (data) => {
  var obj = JSON.parse(data.msg);
  rgb_state = obj;
  var rgb = rgbToHex(obj.g, obj.r, obj.b);
  for(var i = 0; i < NUM_LEDS; i++) {
    pixelData[i] = rgb;
  }
  ws281x.render(pixelData);
  ws281x.setBrightness(obj.a*255);
});
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
