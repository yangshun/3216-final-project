var ArcGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
}

ArcGun.prototype = new ShurikenGun();
ArcGun.prototype.constructor = ArcGun;

ArcGun.prototype.makeShuriken = function(angle) {
  var s = new Boomerang();
  for(var p in this.shuriken) {
    s[p] = this.shuriken[p];
  }

  var sign = 0;
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