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
  this.density = 0;
  this.rotation_step = 30;
  this._type = 'shuriken';
};

Shuriken.prototype = new CollidableObject();

Shuriken.prototype.constructor = Shuriken;

Shuriken.prototype.destroy = function() {
    game.removeShuriken(this);
    this.ninja = null;
    this.view = null;
    delete this;
};

Shuriken.prototype.shoot = function() {
  this.changeLinearVelocity(new Vector2D(this.speed * Math.cos(this.angle),
                                         this.speed * Math.sin(this.angle)));
};

Shuriken.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
};

// Override collision callback
Shuriken.prototype.collide = function(anotherObject) {
  // Our shuriken are like paper, and it goes away with with any collision
  this.dead = true;
};

Shuriken.prototype.tick = function() {
	this.view.x = this.body.GetPosition().get_x() * SCALE;
	this.view.y = this.body.GetPosition().get_y() * SCALE;
  this.view.rotation += this.rotation_step;
  if (this.dead || outside(this.view.x, this.view.y)) {
    this.destroy();
  }
};

var Boomerang = function() {
  Shuriken.call(this);
  this.color = null;
  this.ninja = null;
  this.speed = 0;
  this.size = 0;
  this.damage = 0;
  this.duration = 0;
  this.angle = 0;
  this.density = 0;
  this.rotation_step = 30;
  this._type = 'boomerang';
};

Boomerang.prototype = new Shuriken();
Boomerang.prototype.constructor = Boomerang;

Boomerang.prototype.tick = function() {
  // Angle is 0 at 12 o'clock and clockwise
  var x = this.body.GetLinearVelocity().get_x();
  var y = this.body.GetLinearVelocity().get_y();
  var angle = Math.atan(Math.abs(y) / Math.abs(x));
  if (y < 0) {
    if (x > 0) {
      angle = Math.PI / 2 - angle;
    } else {
      angle = Math.PI * 2 - (Math.PI / 2 - angle);
    }
  } else {
    if (x > 0) {
      angle = Math.PI / 2 + angle;
    } else {
      angle = Math.PI + (Math.PI / 2 - angle);
    }
  }

//  this.last_tick =  Math.max(this.last_tick * 0.80, 0.003) || 0.03;
//  var mag = this.last_tick * Math.sqrt(x*x + y*y);
  var mag = 0.003 * Math.sqrt(x*x + y*y);

  var newX = mag * Math.cos(angle);
  var newY = mag * Math.sin(angle);

  this.body.ApplyLinearImpulse(new b2Vec2(newX, newY), this.body.GetPosition());
	this.view.x = this.body.GetPosition().get_x() * SCALE;
	this.view.y = this.body.GetPosition().get_y() * SCALE;
  this.view.rotation += this.rotation_step;
  if (this.dead || outside(this.view.x, this.view.y)) {
    this.destroy();
  }
};
