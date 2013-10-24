// TODO: pass parameters to constructor
var Ninja = function(identifier, color) {
  ControllableObject.call(this, identifier);
  this.hitPoint = null;
  this.color = color;
  this.size = 0;
  this.speed = 0;
  this.effects = [];
  this.ShurikenGun = new ShurikenGun(this);
}

Ninja.prototype = new ControllableObject();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.move = function() {
}

Ninja.prototype.shoot = function() {
}

Ninja.prototype.destroy = function() {
}

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
}

// Override handleInput function
Ninja.prototype.handleInput = function(input) {
  if (input.key === 'move') {
    var speed = 100.0;
    if (input.speed === 0) speed = 0;

    var vXnew = speed * Math.cos(input.angle);
    var vYnew = speed * Math.sin(input.angle);

    this.changeLinearVelocity(new Vector2D(vXnew, vYnew));
  }
}

Ninja.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x - vXold);
    var deltaPy = mass * (v.y - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
}

// Override tick function
Ninja.prototype.tick = function() {
  this.view.x = this.body.GetPosition().get_x() * SCALE;
  this.view.y = this.body.GetPosition().get_y() * SCALE;
}