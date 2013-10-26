// TODO: pass in parameters
var Shuriken = function() {
  CollidableObject.call(this);
  this.color = null;
  this.ninja = null;
  this.speed = 0;
  this.size = 0;
  this.damage = 0;
  this.duration = 0;
  this.angle = 0;
}

Shuriken.prototype = new CollidableObject();
Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.destroy = function() {
}

// Override collision callback
Shuriken.prototype.collide = function(anotherObject) {
}

Shuriken.prototype.tick = function() {
	this.view.x = this.body.GetPosition().get_x() * SCALE;
	this.view.y = this.body.GetPosition().get_y() * SCALE;
}