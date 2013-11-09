// Client Side js
var socket = io.connect('');
var myname = 'ID '+Math.floor(Math.random()*1000);

socket.on('Welcome', function(data) {
  console.log(data.msg);
});

var reset = function(password) {
  socket.emit('reset', {password: password});
};
