// Socket registration code
var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}
socket.emit('client-register', {name: myname, type: 'arena', room: myroom });

// Socket Events
socket.on('controller-input', function(data) {
	Arena.controller_input(data);
});

socket.on('server-controller-join', function(data) {
	socket.emit('arena-controller-join', Arena.controller_join(data));
});

socket.on('server-controller-leave', function(data) {
	Arena.controller_leave(data);
});

socket.on('server-arena-ready', function(data) {
	if (data.success) {
		$(function() {Arena.init();});
	} else {
		console.log(data.error);
	}
});