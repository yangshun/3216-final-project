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


var Ninja = function(socket_id) {
	this.socket_id = socket_id;
}

Ninja.prototype.update = function () {
	// Update view x and y position
}

var NinjaFactory = function() {

}

NinjaFactory.prototype.getNewNinja = function(socket_id) {
	newNinja = new Ninja(socket_id);
	return newNinja;
}



var init = function () {
	var gameCanvas = $('#gameCanvas')[0];
	stage = new createjs.Stage(gameCanvas);

	Ninjas = [];
	Projectiles = [];

	NinjaFac = new NinjaFactory();

	// stage.addChild(Shuriken1);
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
}

var handleTick = function() {
	Ninjas.map(function(s){s.update();});
	Projectiles.map(function(s){s.update();});
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
		s.image.rotation += e.key * 2;
		// s.rotation += e.key * 2;
		// s.x += e.key * 2;
	}
});

offset_x = 0;
socket.on('server-controller-join', function(data) {
	var s = new Shuriken(data.name);
	s.x = 200 + offset_x;
	s.y = 200;
	offset_x += 225;

	newNinja = NinjaFactory.getNewNinja(data.id);
	Ninjas.push(newNinja);
	stage.addChild(newNinja);
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