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

socket.emit('client-register', { type: 'controller', room: myroom, name: myname });

// Socket Events

$(document).ready(function () {
  console.log(myname);
  leftJoystick  = new VirtualJoystick({
    container : document.getElementById('leftContainer'),
    mouseSupport  : true
  });

  $('#rightContainer').on('click', function() {
    socket.emit('controller-input', { key: 'shoot', name: myname, shoot: 1});
  });

  // rightJoystick  = new VirtualJoystick({
  //   container : document.getElementById('rightContainer'),
  //   mouseSupport  : true
  // });

  // Move Event
  setInterval(function() {
    var x = leftJoystick.deltaX();
    var y = leftJoystick.deltaY();
    var delta = Math.atan2(y, x);
    delta -= Math.PI/2;
    // console.log(delta)
    var key = 'move';
    if (x == 0 && y == 0) key = 'stopmove';

    socket.emit('controller-input', { name: myname, key: key, angle: delta });
  }, 1000 / 30);
});
