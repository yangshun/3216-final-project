var Player = function(identifier, colour) {
    this.identifier = identifier;
    this.colour = colour;
    this.initialize(colour); 
}
Player.prototype = new createjs.Container();

Player.prototype.constructor = Player;

Player.prototype.Container_initialize = Player.prototype.initialize;

Player.prototype.initialize = function(colour) {
    this.Container_initialize();

    var body = new createjs.Shape();
    body.graphics.beginFill(colour).drawCircle(0, 0, 20);
    this.addChild(body);
    this.body = body;

    var turret = new createjs.Shape();
    turret.graphics.beginFill(colour).drawRect(-5, 0, 10, -40);
    this.addChild(turret);
    this.turret = turret;

    this.registerEvents();
}

Player.prototype.registerEvents = function() {
    var object = this;
    GameController.registerEvent(this.identifier, 'move', function(payload) {
        object.x += payload.x;
        object.y += payload.y;
    });

    GameController.registerEvent(this.identifier, 'turret_angle', function(payload) {
        object.turret.rotation = payload.turret_angle;
    });    

    GameController.registerEvent(this.identifier, 'rotate', function(payload) {
        object.turret.rotation += payload.rotation;
    });

    GameController.registerEvent(this.identifier, 'fire', function(payload) {
        var angle = (Math.PI / 180) * object.turret.rotation;
        var velocity = {x: 5*Math.sin(angle), y: -5*Math.cos(angle)};
        var pos = object.localToGlobal(40*Math.sin(angle), -40*Math.cos(angle));

        object.getStage().addChild(new Projectile(object.colour, pos, velocity));
        //object.stage.addChild(new Projectile(object.colour, pos, velocity));
    });
}