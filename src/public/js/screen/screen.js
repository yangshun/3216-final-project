var Screen = (function() {
    var controller_input = function(data) {
        var ninjaToHandle = _.find(game.ninjas, function(ninja) {
            return ninja.identifier === data.id;
        });

        if (ninjaToHandle != null) {
            ninjaToHandle.handleInput(data);
        }
    }

    var controller_join = function(data) {
        if (game.addNinja(data)) {
            console.log("New ninja added " + data.name);
            return {success: true, name: data.name, id: data.id};
        }
        else {
            console.log("Cannot add more ninja");
            return {success: false};
        }
    }

    var controller_leave = function(data) {
        var ninjaToHandle = _.find(game.ninjas, function(ninja) {
            return ninja.identifier === data.id;
        });

        if (ninjaToHandle != null) {
            ninjaToHandle.state = 'remove'; 
        }
    }

    return {controller_input: controller_input,
            controller_join: controller_join,
            controller_leave: controller_leave};
})();