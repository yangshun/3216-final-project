var KeyboardController = function() {
    var bindings = {}; 
    bindings['W'] = function() { GameController.triggerEvent("1", "move", {x: 0, y: -1}); };
    bindings['S'] = function() { GameController.triggerEvent("1", "move", {x: 0, y: 1}); };
    bindings['A'] = function() { GameController.triggerEvent("1", "move", {x: -1, y: 0}); }
    bindings['D'] = function() { GameController.triggerEvent("1", "move", {x: 1, y: 0}); }
    bindings['F'] = function() { GameController.triggerEvent("1", "fire", {projectile: 'normal'}); }
    bindings['Q'] = function() { GameController.triggerEvent("1", "rotate", {rotation: -5}); }
    bindings['E'] = function() { GameController.triggerEvent("1", "rotate", {rotation: 5}); }


    var keyDown = [];
    $(window).keydown(function(e) {
        var key = String.fromCharCode(e.keyCode);

        if (keyDown.indexOf(key) < 0 && (key in bindings)) {
            keyDown.push(key);
        }
    });

    $(window).keyup(function(e) {
        var key = String.fromCharCode(e.keyCode);
        var idx = keyDown.indexOf(key);
        keyDown.splice(idx, 1);
    });

    createjs.Ticker.addEventListener("tick", function() {
        for (var i=0;i<keyDown.length;i++) {
            bindings[keyDown[i]]();
        }
    });
}
