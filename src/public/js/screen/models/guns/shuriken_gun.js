var ShurikenGun = function(ninja, view) {
  GameObject.call(this);
  this.ninja = ninja;
  this.view = view;
  this.angleRange = 0.05; // In radian
  this.delay = 300;
  this.lastShoot = 0;
  var color = null;
  if (this.ninja) { color = this.ninja.color; }
  this.shuriken = {
  	color : color,
  	ninja : this.ninja,
  	speed : 300,
  	size  : 10,
  	damage: 1,
  	duration: 0,
  	density : 0.1
  };
}

ShurikenGun.prototype = new GameObject();

ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.checkDelay = function() {
   var now = (new Date()).getTime();
  if (this.lastShoot + this.delay > now) return false;
  this.lastShoot = now;
  return true;
}

ShurikenGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

	var s = new Shuriken();
	for(var p in this.shuriken) {
		s[p] = this.shuriken[p];
	}

	var sign = Math.random() > 0.5 ? 1.0 : -1.0;
	s.angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = 30 * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = 30 * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(s.ninja.view.x + cX, s.ninja.view.y + cY);

  var sView = new createjs.Bitmap("/images/shuriken-4-point-star.png");
  sView.scaleX = s.size / (344.0 / 2);
  sView.scaleY = s.size / (344.0 / 2);
  sView.regX = 344.0 / 2;
  sView.regY = 344.0 / 2;
  sView.x = centerVector.x;
  sView.y = centerVector.y;

	// Make the Box2D body
	var fixture = new b2FixtureDef;
	fixture.set_density(s.density);
	fixture.set_restitution(0);
	  
	var shape = new b2CircleShape();
	shape.set_m_radius(s.size / SCALE);
	fixture.set_shape(shape);

	var bodyDef = new b2BodyDef;
	bodyDef.set_type(Box2D.b2_dynamicBody);
	bodyDef.set_position(centerVector.tob2Vec2(SCALE));

	var body = game.box.CreateBody(bodyDef);
	body.CreateFixture(fixture);	

	s.body = body;
  s.body.actor = s;
	s.view = sView;

  game.addShuriken(s);

  s.shoot();
}

ShurikenGun.prototype.destroy = function() {
  this.ninja.view.removeChild(this.view);
  this.ninja = null;
  this.view = null;
  delete this;
}
