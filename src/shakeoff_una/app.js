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

var AccessLog = (function() {
  var log = {};
  var blacklist = {};
  var blacklistTime = 1000 * 60 * 5;
  var epsilon = 5;
  
  var inBlackList = function(id, time) {
    if(blacklist[id]) {
      if (time - blacklist[id] > blacklistTime) {
        delete blacklist[id];
        return false;
      }
      return true;
    }
    return false;
  };

  var periodic = function(arr) {
    work = arr.slice(0,10);
    var i, j;
    for (i=9;i>0;i--) {
      for (j=0;j<i;j++) {
        work[j] = Math.abs(work[j+1]-work[j]);
      }
    }
    console.log('last diff : ',Math.abs(work[0]));
    return Math.abs(work[0]) < epsilon;
  };

  // Return true if is bot
  var checkFlood = function(id, time) {
    if (inBlackList(id,time)) return true;
    time = time || (new Date()).getTime();
    // log this one
    if (log[id] !== undefined) {
      log[id].intervals.unshift(time-log[id].last);
      log[id].intervals.splice(10); // Only rmb last 10 intervals
      log[id].last = time;
    } else {
      log[id] = {intervals:[], last:time};
    }
    if (log[id].intervals.length == 10) {
      var isFlooder =  periodic(log[id].intervals);
      blacklist[id] = time;
    }
    return false;
  };
  return {checkFlood: checkFlood};
})();
 
app.configure(function() {
    app.use(allowCrossDomain);
});

// Enable screenless
una.enableServerMode();
una.set('floodControlDelay', 10);
una.server_mode.registerInitState({apple: 0, android: 0});

una.server_mode.registerOnControllerInput('game', function(UnaServer, una_header, payload) {
  var isFlooding = AccessLog.checkFlood(payload.toString());
  if (!isFlooding) {
    var state = UnaServer.getState();
    state[payload]++;
    UnaServer.sendToScreens('game', payload);
  }
});

una.server_mode.registerOnScreenInput('reset', function(UnaServer, una_header, payload) {
  if (payload == 'yoloyolo') {
    UnaServer.setState({apple: 0, android: 0});
    UnaServer.sendToScreens('reset');
  }
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Una server listening on port ' + app.get('port'));
});
una.listen(server);
