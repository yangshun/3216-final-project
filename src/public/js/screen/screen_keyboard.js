bindings = {};
bindings['D'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*0}); }
bindings['C'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*0.25}); }
bindings['S'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*0.5}); }
bindings['Z'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*0.75}); }
bindings['A'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*1.0}); }
bindings['Q'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*1.25}); }
bindings['W'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*1.5}); }
bindings['E'] = function() { Screen.controller_input({id: "kb1", name:"KB1", key:"move", length: 0.75, angle: Math.PI*1.75}); }



var keyDown = [];
var playerJoined = false;
$(window).keydown(function(e) {
    var key = String.fromCharCode(e.keyCode);

    if (key != 'J' && keyDown.indexOf(key) < 0 && (key in bindings)) {
        keyDown.push(key);
    }
});

$(window).keyup(function(e) {
    var key = String.fromCharCode(e.keyCode);

    if (key == 'J' && !playerJoined) {
        playerJoined = true;
        Screen.controller_join({id: "kb1", name:"KB1", ninja:"orange"});
    } else {
        var idx = keyDown.indexOf(key);
        keyDown.splice(idx, 1);
        if (keyDown.length == 0) {
            Screen.controller_input({id: "kb1", name:"KB1", key:"stopmove"});
        }
    }
});

setInterval(function() {
    for (var i=0;i<keyDown.length;i++) {
        bindings[keyDown[i]]();
    }
},1000 / 30);