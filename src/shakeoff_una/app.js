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
  var blacklistTime = 1000 * 60 * 5; // Time a person spends in bl once blacklisted
  var epsilon = 5; // 1=Only very stable intervals, 10=Tolerate differences of 10 ms
  var runway = 10; // Total number of intervals collected before checking
  
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

  var periodicHelper = function(arr, n) {
    for (j=n-1;j>=0;j--) {
      arr[j] = Math.abs(arr[j+1]-arr[j]);
    }
  };

  var periodic = function(arr) {
    var i;
    for (i=runway-1;i>0;i--) {
      periodicHelper(arr, i);
    }
  };
  
  var isPeriodic = function(arr, id) {
    var precalculated = log[id].precalculated;
    if (precalculated) {
      periodicHelper(arr, runway-1); // Do a lot less work if calculated b4
    } else {
      periodic(arr);
      log[id].precalculated = true;
    }

    return arr[0] < epsilon && arr[1] < epsilon && arr[2] < epsilon;
  };

  // Return true if is bot
  var checkFlood = function(id, time) {
    if (inBlackList(id,time)) return true;
    time = time || (new Date()).getTime();
    // log this one
    if (log[id] !== undefined) {
      log[id].intervals.push(time-log[id].last);
      log[id].last = time;
    } else {
      log[id] = {intervals:[], last:time, precalculated:false};
    }
    if (log[id].intervals.length > runway) {
      log[id].intervals.shift();
      console.log(log[id].intervals);
      var isFlooder =  isPeriodic(log[id].intervals, id);
      if (isFlooder) {
        blacklist[id] = time;
      }
    }
    return false;
  };
  return {checkFlood: checkFlood};
})();
 
app.configure(function() {
    app.use(allowCrossDomain);
});

app.get('/trololol/kick/:id', function(req, res) {
  // only allow access to this page if the una header is set properly (by the proxy server)
  if (req.headers['una'] && req.headers['una'] == 'uunnaa') {
    var socket = una.io.sockets.socket(req.params.id);
    if (socket) {
      socket.disconnect();
    }
    return res.redirect('/trololol');
  }
  res.send(false);
});

app.get('/trololol', function(req, res) {
  // only allow access to this page if the una header is set properly (by the proxy server)
  if (req.headers['una'] && req.headers['una'] == 'uunnaa') {
    var out = {};
    for (var room_id in una.io.sockets.manager.rooms) {
      if (room_id == '') {
        continue;
      }
      var sockets = una.io.sockets.clients(room_id.substring(1));
      var clients = [];
      for (var i=0;i<sockets.length;i++) {
        clients.push(sockets[i].una);
      }

      clients = clients.sort(function(x,y) {
        if (x.user_data && y.user_data) {
          return y.user_data.count - x.user_data.count;
        }
      });
      out[room_id] = clients;
    }

    return res.render('admin', {clients: JSON.stringify(out)});
  }
  res.send(404);
});

// Enable screenless
una.enableServerMode();
una.set('floodControlDelay', 10);
una.server_mode.registerInitState({apple: 0, android: 0});

una.server_mode.registerOnControllerInput('game', function(UnaServer, una_header, payload) {
  var isFlooding = AccessLog.checkFlood(una_header.id);
  if (!isFlooding) {
    una_header.user_data.count++;
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
