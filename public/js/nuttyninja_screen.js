// Socket registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

socket.emit('client-register', {name: myname, type: 'screen', room: myroom });

// Socket Events
socket.on('controller-input', function(data) {
	// console.log('Controller : '+data.name+', key : ' + data.key + ', action : '+ data.action);
	// console.log(data);
});

var Shuriken = function(name) {
	this.image = new createjs.Bitmap('/images/chrome.png');

	this.image.regX = 225 / 2.0;
	this.image.regY = 225 / 2.0;

	this.delta = 0;

	this.name = name;
	this.addChild(this.image);
	console.log('HAHAH');
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

	Shurikens = [];
	// Shuriken1 = new Shuriken();
	// Shuriken1.x = 200;
	// Shuriken1.y = 200;

	// stage.addChild(Shuriken1);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
}

var handleTick = function() {
	Shurikens.map(function(s){s.update();});
	stage.update();
}

var delta = 30;
socket.on('controller-input', function(e) {
	// if (e.action == 'vmousedown') {
	// 	if (e.key == 'right') {
	// 		Shuriken1.delta = delta;
	// 	}
	// 	if (e.key == 'left') {
	// 		Shuriken1.delta = -delta;
	// 	}
	// }

	// if (e.action == 'vmouseup' || e.action == 'vmouseout') {
	// 	Shuriken1.delta = 0;
	// }

	if (e.action == 'drag') {
		var s = _.findWhere(Shurikens, {name: e.name});
		// s.image.rotation += e.key * 2;
		s.rotation += e.key * 2;
		s.x += e.key * 2;
	}
});

offset_x = 0;
socket.on('server-controller-join', function(data) {
	var s = new Shuriken(data.name);
	s.x = 200 + offset_x;
	s.y = 200;
	offset_x += 225;

	Shurikens.push(s);
	stage.addChild(s);
});

socket.on('server-controller-leave', function(data) {
	console.log('LEAVER!!!');
	console.log(data.name);
	Shurikens = _.reject(Shurikens, function(s) {
		if(s.name == data.name) {
			console.log('quit');
			console.log(stage.removeChild(s));
			return true;
		}
		return false;
	});
});

$(function() {init();});