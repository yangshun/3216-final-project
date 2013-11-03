var Banana = function() {
  Shuriken.call(this);
  this._type = 'banana';
  this.width = 24;
  this.height = 16;
};

Banana.prototype = new Shuriken();
Banana.prototype.constructor = Banana;

Banana.prototype.tick = function() {
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

Banana.make = function(ninja, centerVector, angle) {
  var s = new Banana();  
  s.ninja = ninja;
  s.angle = angle;

  var sView = new createjs.Bitmap("/images/projectiles/banana.png");
  sView.scaleX = s.width / 300.0;
  sView.scaleY = s.height / 218.0;
  sView.regX = 300.0 / 2;
  sView.regY = 218.0 / 2;
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

  var body = game.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);  

  s.body = body;
  s.body.actor = s;
  s.view = sView;

  return s;
}