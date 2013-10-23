var Projectile = function(colour,pos, velocity) {
    this.colour = colour;
    this.velocity = velocity;
    this.initialize(colour); 

    this.x = pos.x;
    this.y = pos.y;
}

Projectile.prototype = new createjs.Container();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.Container_initialize = Projectile.prototype.initialize;

Projectile.prototype.initialize = function(colour) {
    this.Container_initialize();

    var body = new createjs.Shape();
    body.graphics.beginFill(colour).drawCircle(0, 0, 5);
    this.addChild(body);
    this.body = body;

    this.registerEvent();
}

Projectile.prototype.registerEvent = function() {
    var object = this;
    createjs.Ticker.addEventListener("tick", function() {
        object.x += object.velocity.x;
        object.y += object.velocity.y;

        var stage = object.getStage();
        if (object.x < 0 || object.y < 0 || object.x > stage.canvas.width || object.y > stage.canvas.height) {

        }
    });
}