// Socket registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

socket.emit('client-register', { type: 'screen', room: myroom });

// Socket Events
socket.on('controller-input', function(data) {
	console.log('Controller : '+data.name+', key : ' + data.key + ', action : '+ data.action);
	console.log(data);
});

var Shuriken = function() {
	this.image = new createjs.Bitmap('images/chrome.jpg');

	this.image.regX = 225 / 2.0;
	this.image.regY = 225 / 2.0;

	this.delta = 0;

	this.addChild(this.image);
}

Shuriken.prototype = new createjs.Container();
Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.rotateImage = function (r) {
	this.image.rotation += r;
}

Shuriken.prototype.update = function() {
	// Update its rotation
	this.image.rotation += this.delta;
}

var init = function () {
	var gameCanvas = $('#gameCanvas')[0];
	stage = new createjs.Stage(gameCanvas);

	Shuriken1 = new Shuriken();
	Shuriken1.x = 200;
	Shuriken1.y = 200;

	var i = 0;
	stage.addChild(Shuriken1);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
}

var handleTick = function() {
	Shuriken1.update();
	stage.update();
}

var delta = 30;
socket.on('controller-input', function(e) {
	if (e.action == 'vmousedown') {
		if (e.key == 'right') {
			Shuriken1.delta = delta;
		}
		if (e.key == 'left') {
			Shuriken1.delta = -delta;
		}
	}

	if (e.action == 'vmouseup' || e.action == 'vmouseout') {
		Shuriken1.delta = 0;
	}
})

$(function() {init();});