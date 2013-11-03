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

var loadJoysticks = function() {
  console.log(myname);
  // Re-display the joystick divs
  $('.joystick').css('display', 'block');
  console.log('sdfajsflk');

  leftJoystick  = new VirtualJoystick({
    container : document.getElementById('leftContainer'),
    mouseSupport  : true
  });

  $('#rightContainer').on('touchstart', function() {
    socket.emit('controller-input', { key: 'shoot', name: myname, shoot: 1});
  });

  $('#shieldContainer').on('touchstart', function() {
    socket.emit('controller-input', { key: 'shield', name: myname });
  });

  $('#shieldContainer').on('touchend', function() {
    socket.emit('controller-input', { key: 'unshield', name: myname });
  });
  // rightJoystick  = new VirtualJoystick({
  //   container : document.getElementById('rightContainer'),
  //   mouseSupport  : true
  // });

  // Move Event
  var isMoving = false;
  setInterval(function() {
    var x = leftJoystick.deltaX();
    var y = leftJoystick.deltaY();
    var delta = Math.atan2(y, x);
    delta -= Math.PI/2;
    // console.log(delta)
    if (x === 0 && y === 0) {
      if (isMoving) {
        isMoving = false;
        socket.emit('controller-input', { name: myname, key: 'stopmove'});
      }
    }
    else {
      var l = Math.min(Math.sqrt(x * x + y * y) / 50.0, 1.0);
      isMoving = true;
      socket.emit('controller-input', { name: myname, key: 'move', angle: delta, length: l });
    }

  }, 1000 / 30);
};

var loadNinja = function() {
  // Figure out what is checked and his name
  $('#goBtn').on('click', function() {
    var myninja = $('input:radio[name="ninjaChoose"]:checked')[0].value;
    myname = $('#playername').val();
    $('.carousell').css('display', 'none');
    var data = { type: 'controller', room: myroom, name: myname, ninja: myninja};
    socket.emit('client-register', data);
  });
};

// Socket Events
// 1. Choose your ninja
// 2. client-register
// 3. Arena replies ok and you're good to go
// socket.emit('client-register', { type: 'controller', room: myroom, name: myname, ninja: 'fat ninja'});
$(function() { loadNinja(); });
socket.on('arena-controller-join', function(data) {
  if (data.success) {
    $(document).ready(loadJoysticks);
  }
});

