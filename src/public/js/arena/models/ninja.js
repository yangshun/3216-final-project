// TODO: pass parameters to constructor
var Ninja = function(player, color) {
  ControllableObject.call(this, player);
  this.hitPoint = 10;
  this.maxHitPoint = 10;
  this.color = color;
  this.size = NINJA_RADIUS;
  this.speed = 250.0;
  this.angle = Math.PI / 2;
  this.state = 'live';
  this.effects = [];
  this.ShurikenGun = new ShurikenGun(this);

  this.followers = [];

  this.ninja_shield = null;

  this._type = 'ninja';
};

Ninja.prototype = new ControllableObject();
Ninja.prototype.constructor = Ninja;

Ninja.prototype.move = function(angle, speed) {
};

Ninja.prototype.shoot = function() {
  this.ShurikenGun.makeShuriken(this.angle);
};

Ninja.prototype.shield = function() {
  // Might want to do effects here
  this.ninja_shield.active(true);
};

Ninja.prototype.unshield = function() {
  this.ninja_shield.active(false);
};

Ninja.prototype.destroy = function() {
  this.ShurikenGun.destroy();
  this.ShurikenGun = null;
  
  this.effects.map(function(e) { e.destroy(); });
  this.effects = null;

  this.followers.map(function(f) { f.destroy(); });
  this.followers = [];
  
  game.removeNinja(this);
  this.view = null;
  delete this;
};

// Override collision callback
Ninja.prototype.collide = function(anotherObject) {
  if (anotherObject instanceof Shuriken) {
    if (anotherObject.ninja == this) {
      // Anything we want to happen here?
    } else {
      this.hitPoint -= anotherObject.damage;
    }
    if (this.hitPoint <= 0) { 
      this.state = 'dead'; 
      PubSub.publish('ninja.death', {
        killer : anotherObject.ninja.player.name,
        victim: this.player.name
      });
    }
  }

  if (anotherObject instanceof HealthTile) {
    this.hitPoint = Math.min(anotherObject.heal + this.hitPoint, this.maxHitPoint);
  }

  if (anotherObject instanceof SpeedTile) {
    this.speed += 100; 
    var object = this;
    TimedEventManager.addEvent(3000, function() {
      object.speed -= 100;
    });
  }

  if ((anotherObject instanceof SnowFlake) && (this.speed > 50.0)){
    this.speed -= 50.0; 
    var object = this;
    TimedEventManager.addEvent(3000, function() {
      object.speed += 50.0;
    });
  }

  if (anotherObject instanceof GunTile) {
    this.equipGun(anotherObject.gun_type);
  }

  this.updateHitPointBar();
};

Ninja.prototype.equipGun = function(gun_type) {
  if (this.ShurikenGun) this.ShurikenGun.destroy();

  var gun = GunFactory.makeGun({ninja: this, type: gun_type});
  this.ShurikenGun = gun;
  gun.view.x = 0;
  gun.view.y = 0;
  this.view.addChildAt(gun.view, 0);
};

Ninja.prototype.updateHitPointBar = function() {
  var hpBar = this.view.getChildByName("hitpoint");
  var ratio = this.hitPoint / this.maxHitPoint;

  var width = 3*this.size*ratio/2;
  width -= 3*this.size/2;

  hpBar.scaleX = ratio;
  hpBar.x = width;
};

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
    if (this.state == 'live') { this.shoot(); }
  } else if (input.key === 'shield') {
    if (this.state == 'live') { this.shield(); }
  } else if (input.key === 'unshield') {
    if (this.state == 'live') { this.unshield(); }
  }
};

Ninja.prototype.changeLinearVelocity = function(v) {
    var vXold = this.body.GetLinearVelocity().get_x();
    var vYold = this.body.GetLinearVelocity().get_y();

    var mass = this.body.GetMass();
    var deltaPx = mass * (v.x / SCALE - vXold);
    var deltaPy = mass * (v.y / SCALE - vYold);

    this.body.ApplyLinearImpulse(new b2Vec2(deltaPx, deltaPy), this.body.GetPosition());
};

Ninja.prototype.addEffect = function(e) {
  this.effects.push(e);
};

Ninja.prototype.removeEffect = function(e) {
  this.effects = _.without(this.effects, e);
};

Ninja.prototype.reset = function(position) {
  this.state = 'live';
  this.hitPoint = 10;
  this.angle = 0.0;
  
  this.body.SetActive(true);
  this.body.SetTransform(position.tob2Vec2(SCALE), 0.0);
  this.body.SetLinearVelocity(new b2Vec2(0, 0));
  this.body.SetAngularVelocity(0);
 
  this.updateHitPointBar();

  this.equipGun('none');
};

Ninja.prototype.addFollower = function(f) {
  this.followers.push(f);
};

Ninja.prototype.removeFollower = function(f) {
  this.followers = _.without(this.followers, f);
};

// Override tick function
Ninja.prototype.tick = function() {
  var that = this;
  if (this.state == 'live') {
    this.view.x = this.body.GetPosition().get_x() * SCALE;
    this.view.y = this.body.GetPosition().get_y() * SCALE;
    this.view.getChildByName("body").rotation = toDegree(this.angle);
    this.view.getChildByName("gun").rotation = toDegree(this.angle);

    this.ninja_shield.tick(this.view.x, this.view.y, this.angle - Math.PI / 2);
    this.effects.map(function(e) { e.tick(that); });
    this.followers.map(function(e) { e.tick(that); });
  } else if (this.state == 'dead') {
    this.state = 'reviving';
    this.body.SetActive(false);
    game.reviveNinja(this, 1000.0);
  } else if (this.state == 'remove') {
    PubSub.publish('ninja.remove', {name: this.player.name, ninja: this });
    this.destroy();
  }
};
