// TODO: pass parameters to constructor
var Ninja = function() {
  ControllableObject.call(this);
  this.hitPoint = null;
  this.color = null;
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

Ninja.protype.destroy = function() {
}

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
}

// Override handleInput function
Ninja.protype.handleInput = function(input) {
}