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
	if (data.key == 'move') {
		if (data.speed == 1) {
			speed = 10;
			GameController.triggerEvent(data.name, 'move', {x: speed*Math.cos(data.angle), y: speed*Math.sin(data.angle)});
			GameController.triggerEvent(data.name, 'turret_angle', {turret_angle: 90 + (180*data.angle)/Math.PI});
		}
	} else if (data.key == 'shoot') {
		GameController.triggerEvent(data.name, 'fire');
	}
});


var NinjaFactory = function() {

}

NinjaFactory.prototype.getNewNinja = function(socket_id) {
	newNinja = new Person();
	return newNinja;
}

var GameController = new Controller(function(){});

var init = function () {
	var gameCanvas = $('#gameCanvas')[0];
    stage = new createjs.Stage(gameCanvas);

	Ninjas = [];
	Projectiles = [];
	Colors = ['orange', 'red', 'blue', 'green'];

	NinjaFac = new NinjaFactory();

	/*
	gameMap = new Map();
	gameMap.generateSimpleMap();
	*/

	// stage.addChild(Shuriken1);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
}

var handleTick = function() {
	Ninjas.map(function(s){s.update();});
	Projectiles.map(function(s){s.update();});

	stage.update();
}

offset_x = 0;
socket.on('server-controller-join', function(data) {
	if (Colors.length > 0) {
		var player = new Player(data.name, Colors[0]);
		player.x = 200;
		player.y = 200;
		Colors.splice(0, 1);
	}

	stage.addChild(player);
});

socket.on('server-controller-leave', function(data) {
	console.log('LEAVER!!!');
	console.log(data.name);
});

$(function() {init();});