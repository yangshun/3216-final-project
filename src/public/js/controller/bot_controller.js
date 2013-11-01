// Add fastclick to controllers
window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);

// Socket Registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default room
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

var loadNinja = function() {
  // Figure out what is checked and his name
  var myninja = 'red';

  myname = 'BOT#'+Math.round(Math.random() * 100000);
  var data = { type: 'controller', room: myroom, name: myname, ninja: myninja};
  socket.emit('client-register', data);
};

var loadBot = function() {
	// Randomly move and shoot
	var delta = Math.random() * Math.PI * 2;
	setInterval(function() {
		var sign = Math.floor(Math.random() * 2);
		delta += sign * Math.random() * Math.PI * 2 / 4;
		var l = 1.0;
		socket.emit('controller-input', { name: myname, key: 'move', angle: delta, length: l });
	}, 100);

	setInterval(function() {
		socket.emit('controller-input', { key: 'shoot', name: myname, shoot: 1});
	}, 10);
};

// Socket Events
// 1. Choose your ninja
// 2. client-register
// 3. Screen replies ok and you're good to go
// socket.emit('client-register', { type: 'controller', room: myroom, name: myname, ninja: 'fat ninja'});
$(function() { loadNinja(); });
socket.on('screen-controller-join', function(data) {
  if (data.success) {
    $(document).ready(loadBot);
  }
});

