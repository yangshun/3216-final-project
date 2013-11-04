var Arena = (function() {
  var init = function() {
    var gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    var stage = new createjs.Stage(gameCanvas);

    game = new Game();
    game.canvas = gameCanvas;
    game.stage = stage;
    game.map = new Map();
    game.map.generateRandomMap();

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', handleTick);

    // Sample call to register collision
    CollisionManager.registerCallback(HealthTile, Ninja, function(objA, objB) {
      TimedEventManager.addEvent(2000, function() {
        console.log(objA);
        console.log(objB);
        console.log((new Date).getTime() + ": 2 seconds after eating!");
      });
      console.log((new Date).getTime() + ": Ninja is eating health woots");
    });
  };

  var handleTick = function(ticker_data) {
    var timestep = Math.min(ticker_data.delta, 34) / 1000.0;
    game.box.Step(timestep, 8.0, 3.0);
    game.box.ClearForces();

    game.ninjas.map(function(s){s.tick();});
    game.shurikens.map(function(s){s.tick();});
    game.map.tick();

    game.stage.update();
    TimedEventManager.tick();
  }

  var controller_input = function(data) {
    var ninjaToHandle = _.find(game.ninjas, function(ninja) {
      return ninja.identifier === data.id;
    });

    if (ninjaToHandle != null) {
      ninjaToHandle.handleInput(data);
    }
  };

  var controller_join = function(data) {
    if (game.addNinja(data)) {
      console.log("New ninja added " + data.name);
      return {success: true, name: data.name, id: data.id};
    }
    else {
      console.log("Cannot add more ninja");
      return {success: false};
    }
  };

  var controller_leave = function(data) {
    var ninjaToHandle = _.find(game.ninjas, function(ninja) {
      return ninja.identifier === data.id;
    });

    if (ninjaToHandle != null) {
      ninjaToHandle.state = 'remove'; 
    }
  };

  return {init: init,
      controller_input: controller_input,
      controller_join: controller_join,
      controller_leave: controller_leave
    };
})();

// Resize code

function resize() {
  // var ratio = game.canvas.width / game.canvas.height;
  // console.log(window.innerHeight, window.innerWidth);
  // if (window.innerHeight * ratio > window.innerWidth) {
  //   game.canvas.style.width = window.innerWidth +'px';
  //   game.canvas.style.height = (window.innerWidth / ratio) +'px';
  // } else {
  //   game.canvas.style.height = window.innerHeight +'px';
  //   game.canvas.style.width = (window.innerHeight * ratio) +'px';
  // }
  game.canvas.style.width = window.innerWidth +'px';
  game.canvas.style.height = window.innerHeight +'px';
}

window.addEventListener("resize", resize, false);

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen();
    setTimeout(resize, 1000);
  }
}, false);
