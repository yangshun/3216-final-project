var ShurikenGun = function(ninja) {
  GameObject.call(this);
  this.ninja = ninja;
  this.angleRange = 0.05; // In radians

  this.shuriken = {
  	color : this.ninja.color,
  	ninja : this.ninja,
  	speed : 300,
  	size  : 5,
  	damage: 1,
  	duration: 0,
  	density : 0.1
  };
}

ShurikenGun.prototype = new GameObject();
ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.makeShuriken = function(angle) {
	var s = new Shuriken();
	for(var p in this.shuriken) {
		s[p] = this.shuriken[p];
	}

	var sign = Math.random() > 0.5 ? 1.0 : -1.0;
	s.angle = angle + sign * Math.random() * this.angleRange;

	// Make the easeljs view
	var sView = new createjs.Shape();
	sView.x = s.ninja.view.x + Math.cos(angle) * (s.ninja.size + 30);
	sView.y = s.ninja.view.y + Math.sin(angle) * (s.ninja.size + 30);
	sView.graphics.beginFill(s.color).drawCircle(0,0, s.size)

	// Make the Box2D body
	var fixture = new b2FixtureDef;
	fixture.set_density(s.density);
	fixture.set_restitution(0);
	  
	var shape = new b2CircleShape();
	shape.set_m_radius(s.size / SCALE);
	fixture.set_shape(shape);

	var bodyDef = new b2BodyDef;
	bodyDef.set_type(Box2D.b2_dynamicBody);
	bodyDef.set_position(new Vector2D(sView.x, sView.y).tob2Vec2(SCALE));

	var body = game.box.CreateBody(bodyDef);
	body.CreateFixture(fixture);	

	s.body = body;
	s.view = sView;

	game.shurikens.push(s);
	game.stage.addChild(s.view);

  s.shoot();
}