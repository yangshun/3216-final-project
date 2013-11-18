var Soul = function() {
  Shuriken.call(this);
  this._type = 'soul';
  this.width = 30;
  this.height = 30;
  this.damage = 20;
  this.rotation_step = 0;
  this.speed = 600;
};

Soul.prototype = new Shuriken();
Soul.prototype.constructor = Soul;

Soul.offsetX = function() {
  return 60.0;
}

Soul.make = function(monster, centerVector, angle) {
  var s = new Soul();  
  s.monster = monster;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/soul.png");
  sView.scaleX = s.width / 225.0;
  sView.scaleY = s.height / 225.0;
  sView.regX = 225.0 / 2;
  sView.regY = 225.0 / 2;
  sView.x = centerVector.x;
  sView.y = centerVector.y;

  // Make the Box2D body
  var fixture = new b2FixtureDef;
  fixture.set_density(s.density);
  fixture.set_restitution(0);
    
  var shape = new b2PolygonShape;
  shape.SetAsBox(s.width / SCALE / 2, s.height / SCALE / 2);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef;
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(centerVector.tob2Vec2(SCALE));
  bodyDef.set_angle(angle);

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);  
  body.SetAngularVelocity(toRadian(s.rotation_step));

  s.body = body;
  s.body.actor = s;
  s.view = sView;

  return s;
}
