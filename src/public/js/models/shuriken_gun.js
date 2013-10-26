var ShurikenGun = function(ninja) {
  GameObject.call(this);
  this.ninja = ninja;

  this.shuriken = {
  	color : this.ninja.color,
  	ninja : this.ninja,
  	speed : 110,
  	size  : 10,
  	damage: 1,
  	duration: 0
  };
}

ShurikenGun.prototype = new GameObject();
ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.makeShuriken = function(angle) {
	var s = new Shuriken();
	for(var p in this.shuriken) {
		s[p] = this.shuriken[p];
	}

	s.angle = angle;

	// Make the easeljs view
	var sView = new createjs.Shape();
	// sView.x = s.ninja.x + Math.cos(angle) * s.ninja.size;
	// sView.y = s.ninja.y + Math.sin(angle) * s.ninja.size;
	sView.x = s.ninja.view.x;
	sView.y = s.ninja.view.y;
	sView.graphics.beginFill(s.color).drawCircle(0,0, s.size)

	// Make the Box2D body
	var fixture = new b2FixtureDef;
	fixture.set_density(1);
	fixture.set_restitution(0);
	fixture.set_friction(1.0);
	  
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
}