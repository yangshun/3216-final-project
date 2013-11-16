
/**
 * Module dependencies.
 */

var una = require('una');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = una.app;
var express = una.express;

// all environments
app.set('port', process.env.PORT || 3216);
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
app.post('/choose', routes.choose);
app.get('/', routes.index);
app.get('/landing', routes.landing);
app.get('/play', routes.arena);
app.get('/play/*', routes.arenaWithRoom);
app.get('/join', routes.controller);
app.get('/join/*', routes.controllerWithRoom);
app.get('/bot', routes.botcontrollerWithRoom);
app.get('/bot/*', routes.botcontrollerWithRoom);

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

una.listen(server);