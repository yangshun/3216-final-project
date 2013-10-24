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
	var ninjaToHandle = _.find(game.ninjas, function(ninja) {
		return ninja.identifier === data.name;
	});

	if (ninjaToHandle != null) {
		ninjaToHandle.handleInput(data);
	}
});

socket.on('server-controller-join', function(data) {
	if (game.addNinja(data.name)) {
		console.log("New ninja added " + data.name);
	} else {
		console.log("Cannot add more ninja");
	}
});

socket.on('server-controller-leave', function(data) {
	console.log('LEAVER!!!');
	console.log(data.name);
});

var init = function () {
	var gameCanvas = $('#gameCanvas')[0];
  var stage = new createjs.Stage(gameCanvas);

	game = new Game();
	game.stage = stage;

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
}

var handleTick = function() {
	game.box.Step(1.0/60.0, 10.0, 10.0);

	game.ninjas.map(function(s){s.tick();});
	game.shurikens.map(function(s){s.tick();});

	game.stage.update();
}

$(function() {
	init();
});
