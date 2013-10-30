var Screen = (function() {
    var init = function() {
        var gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;

        var stage = new createjs.Stage(gameCanvas);

        game = new Game();
        game.canvas = gameCanvas;
        game.stage = stage;
        game.map = new Map();
        game.map.generateSimpleMap();

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', handleTick);
    };

    var handleTick = function(ticker_data) {
        var timestep = ticker_data.delta / 1000.0;
        game.box.Step(timestep, 8.0, 3.0);
        game.box.ClearForces();

        game.ninjas.map(function(s){s.tick();});
        game.shurikens.map(function(s){s.tick();});
        game.map.tick();

        game.stage.update();
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
window.addEventListener("resize", function() {
    var ratio = game.canvas.width / game.canvas.height;
    if (window.innerHeight * ratio > window.innerWidth) {
        game.canvas.style.width = window.innerWidth +'px';
        game.canvas.style.height = (window.innerWidth / ratio) +'px';
    } else {

        game.canvas.style.height = window.innerHeight +'px';
        game.canvas.style.width = (window.innerHeight * ratio) +'px';
    }
}, false);