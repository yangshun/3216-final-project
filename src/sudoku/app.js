
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// For routing
app.get('/', routes.index);
app.get('/board', routes.board);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
};
 
app.configure(function() {
    app.use(allowCrossDomain);
});

// Set http constants to allow infinite # of sockets
http.globalAgent.maxSockets = Infinity;

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var randomString = function(len) {
  return Math.random().toString(36).slice(2,len+2);
};


// Websockets stuff

var io = io.listen(server);
io.set('log level', 2);

var apple_count = 0;
var android_count = 0;

io.sockets.on('connection', function(socket) {
  var sendResults = function(data) {
    io.sockets.emit('results', {
      apple_count: apple_count,
      android_count: android_count,
      type: data.type
    });
  };

  socket.emit('welcome', {
    msg: 'Connected',
    apple_count : apple_count,
    android_count: android_count
  });

  socket.on('reset', function(data) {
    if (data.password === 'yoloyolo') {
      apple_count = 0;
      android_count = 0;
    }
    sendResults({type: 'apple'});
  });

  socket.on('shakeit', function(data) {
    switch (data.type) {
      case 'android':
        android_count++;
        break;
      case 'apple':
        apple_count++;
        break;
      default:
        return;
    }
    sendResults(data);
  });
});
