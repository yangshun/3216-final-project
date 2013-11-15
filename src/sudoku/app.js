
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

// Websockets stuff

var io = io.listen(server);
io.set('log level', 2);

var initboard =  
             [['', '', '', 6, 8, 1, '', 7, 3],
              [3, 8, '', '', '', '', 1, 9, 4],
              [7, 5, 1, 3, '', 9, '', '', ''],
              [2, '', 4, 9, 5, '', 6, 8, ''],
              [1, '', '', 2, 6, '', 4, '', ''],
              [8, '', 3, '', '', 4, '', 5, 9],
              [9, 4, 2, '', 3, '', '', '', 5],
              ['', 1, 7, '', '', 2, 3, 4, ''],
              ['', '', '', 4, 1, 7, 9, '', '']];

var board = initboard.map(function(a){return a.slice();});
io.sockets.on('connection', function(socket) {
  
  socket.emit('welcome', {
    msg: 'Connected',
    board: board,
    init: initboard // coz i'm too lazy
  });

  socket.on('reset', function(data) {
    if (data.password === 'yoloyolo') {
      // do the necessary reset  
    }
  });

  socket.on('submit-response', function(data) {
    var r = data.row - 1;
    var c = data.col - 1;

    // Check that it's not overwriting our original values
    if(initboard[r][c] !== '') return;

    board[data.row-1][data.col-1] = data.board_value;
    io.sockets.emit('update-board', data);
  });
});
