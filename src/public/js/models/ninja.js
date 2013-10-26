// TODO: pass parameters to constructor
var Ninja = function(identifier, color) {
  ControllableObject.call(this, identifier);
  this.hitPoint = 100;
  this.color = color;
  this.size = NINJA_RADIUS;
  this.speed = 100.0;
  this.angle = 0.0;

  this.effects = [];
  this.ShurikenGun = new ShurikenGun(this);
}

Ninja.prototype = new ControllableObject();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.move = function(angel, speed) {
}

Ninja.prototype.shoot = function() {
  this.ShurikenGun.makeShuriken(this.angle);
}

Ninja.prototype.destroy = function() {
}

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
  if (anotherObject instanceof Shuriken) {
    this.hitPoint -= anotherObject.damage;
    console.log(this.hitPoint);
  }
}

// Override handleInput function
Ninja.prototype.handleInput = function(input) {
  if (input.key === 'move') {
    this.angle = input.angle;
    var vXnew = this.speed * Math.cos(input.angle);
    var vYnew = this.speed * Math.sin(input.angle);
    this.changeLinearVelocity(new Vector2D(vXnew, vYnew));
  } else if (input.key === 'stopmove') {
    this.changeLinearVelocity(new Vector2D(0, 0));
  } else if (input.key === 'shoot') {
    this.shoot();
  }
}

Ninja.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
}

// Override tick function
Ninja.prototype.tick = function() {
  this.view.x = this.body.GetPosition().get_x() * SCALE;
  this.view.y = this.body.GetPosition().get_y() * SCALE;
}