var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.stage = null;
  this.colors = ['orange', 'red', 'blue', 'green'];

  this.box = new b2World(new b2Vec2(0, 0), true);
}

Game.prototype.addNinja = function(identifer) {
  if (this.colors.length === 0) return false;

  // var position = getFreePosition
  // var position = new Vector2D(Math.random() * 500, 100);
  var position = new Vector2D(300, 200);

  var fixture = new b2FixtureDef;
  fixture.set_density(1);
  fixture.set_restitution(0);
  fixture.set_friction(1.0);
  
  var shape = new b2CircleShape();
  shape.set_m_radius(NINJA_RADIUS / SCALE);
  fixture.set_shape(shape);

  var bodyDef = new b2BodyDef;
  bodyDef.set_type(Box2D.b2_dynamicBody);
  bodyDef.set_position(position.tob2Vec2(SCALE));

  var body = this.box.CreateBody(bodyDef);
  body.CreateFixture(fixture);
  
  var color = this.colors.splice(0, 1)[0];
  var ninja = new Ninja(identifer, color);
  ninja.size = NINJA_RADIUS;

  var view = new createjs.Shape();
  view.x = position.x;
  view.y = position.y;
  view.graphics.beginFill(color).drawCircle(0, 0, NINJA_RADIUS);

  ninja.body = body;
  ninja.view = view;

  this.ninjas.push(ninja);
  this.stage.addChild(ninja.view);

  return true;
}

Game.prototype.addShuriken = function(s) {
  this.shurikens.push(s);
  this.stage.addChild(s.view);
}

Game.prototype.removeShuriken = function(s) {
  this.stage.removeChild(s.view);
  this.shurikens = _.without(this.shurikens, s);
  this.box.DestroyBody(s.body);
}