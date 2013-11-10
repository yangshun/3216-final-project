var path = require('path');
var una = require('una');
var express = una.express;
var app = una.app;
var routes = require('./routes');
var http = require('http');

// App setup
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// For routing
app.get('/', routes.index);
app.get('/results', routes.results);

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

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Una server listening on port ' + app.get('port'));
});
una.listen(server);