const exec = require('child_process').execSync;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const GPIO = require("gpio-c.h.i.p");
const wc = require('node-webcam');

var opts = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: false,
    output: "jpeg",
    device: false,
    callbackReturn: "base64",
    verbose: false
};

server.listen(80);

io.on('connection', function(socket){

});

app.set('viewss', './views');
app.set('view engine', 'pug');

var Api = express.Router();
Api.get('/gpio/:pin/', function(req, res){
	res.send(GPIO.read(req.params.pin));
});

Api.post('/gpio/:pin/:io/:value', function(req, res){
	GPIO.write(req.params.pin, req.params.value, req.params.io);
	res.send(req.params);
});

app.use('/api', Api);

app.get('/', function(req, res){
	res.render('index',{temperature: exec('sudo axp209 --temperature')});
});

app.get('/gpio', function(req, res){
	res.render('gpio');
});

app.get('/camera', function(req, res){
	res.render('camera');
});

app.get('/setup', function(req, res){
	res.render('setup');
});

setInterval(function(){
	wc.capture('security', opts, function(err, data){
		if(data != null){
			io.emit('camera', data);
		}
	});
}, 1000);