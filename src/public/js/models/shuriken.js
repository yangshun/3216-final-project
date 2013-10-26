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

Shuriken.prototype.shoot = function() {
  this.changeLinearVelocity(new Vector2D(this.speed * Math.cos(this.angle), 
                                         this.speed * Math.sin(this.angle)));
}

Shuriken.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
}

// Override collision callback
Shuriken.prototype.collide = function(anotherObject) {
}

Shuriken.prototype.tick = function() {
	this.view.x = this.body.GetPosition().get_x() * SCALE;
	this.view.y = this.body.GetPosition().get_y() * SCALE;
}