// TODO: pass parameters to constructor
var Ninja = function(player, color) {
  ControllableObject.call(this, player);
  this.hitPoint = 10;
  this.maxHitPoint = 10;
  this.color = color;
  this.size = NINJA_RADIUS;
  this.speed = 250.0;
  this.angle = 0.0;
  this.state = 'live';
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
  game.removeNinja(this);
  delete this;
}

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
  if (anotherObject instanceof Shuriken) {
    this.hitPoint -= anotherObject.damage;
    if (this.hitPoint <= 0) { this.state = 'dead'; }
  }

  if (anotherObject instanceof HealthTile) {
    this.hitPoint = Math.min(anotherObject.heal + this.hitPoint, this.maxHitPoint);
  }

  if (anotherObject instanceof SpeedTile) {
    this.speed *= 2; 
  }

  this.updateHitPointBar();
}

Ninja.prototype.updateHitPointBar = function() {
  var hpBar = this.view.getChildByName("hitpoint");
  var ratio = this.hitPoint / this.maxHitPoint;

  var width = 3*NINJA_RADIUS*ratio/2;
  width -= 3*NINJA_RADIUS/2;
  
  hpBar.scaleX = ratio;
  hpBar.x = width;
}

// Override handleInput function
Ninja.prototype.handleInput = function(input) {
  if (input.key === 'move') {
    this.angle = input.angle;
    var vXnew = this.speed * input.length * Math.cos(input.angle);
    var vYnew = this.speed * input.length * Math.sin(input.angle);
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

Ninja.prototype.reset = function(position) {
  this.state = 'live';
  this.hitPoint = 10;
  this.angle = 0.0;
  
  this.body.SetActive(true);
  this.body.SetTransform(position.tob2Vec2(SCALE), 0.0);
  this.body.SetLinearVelocity(new b2Vec2(0, 0));
  this.body.SetAngularVelocity(0);
 
  this.updateHitPointBar();
 }

// Override tick function
Ninja.prototype.tick = function() {
  if (this.state == 'live') {
    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
    this.view.getChildByName("body").rotation = toDegree(this.angle);
  } else if (this.state == 'dead') {
    this.state = 'reviving';
    this.body.SetActive(false);
    game.reviveNinja(this, 1000.0);
  } else if (this.state == 'remove') {
    this.destroy();
  }
}