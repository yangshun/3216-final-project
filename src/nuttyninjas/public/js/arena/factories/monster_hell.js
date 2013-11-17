var MonsterHell = {
  image: "/images/monster.png",

  // data: {position: Vector2D, player: Player, color: String}
  makeMonster: function(data) {
    if (!this.canMakeMonster(data)) return false;

    var fixture = new b2FixtureDef;
    fixture.set_density(50);
    fixture.set_restitution(0);
    fixture.set_friction(1.0);

    var shape = new b2CircleShape();
    shape.set_m_radius(MONSTER_RADIUS / SCALE);
    fixture.set_shape(shape);

    var bodyDef = new b2BodyDef;
    bodyDef.set_type(Box2D.b2_dynamicBody);
    bodyDef.set_position(data.position.tob2Vec2(SCALE));

    var body = game.box.CreateBody(bodyDef);
    body.CreateFixture(fixture);
    
    var monster = new Monster();
    monster.size = MONSTER_RADIUS;

    var view = new createjs.Container();
    view.x = data.position.x;
    view.y = data.position.y;

    var image_name = this.image;
    var body_view = new createjs.Bitmap(image_name);
    body_view.name = "body";
    body_view.scaleX = monster.size  / (600 / 2.0);
    body_view.scaleY = monster.size  / (600 / 2.0);
    body_view.regX = 600 / 2;
    body_view.regY = 600 / 2;
    view.addChild(body_view);

    var hitpoint_view = new createjs.Shape();
    hitpoint_view.name = "hitpoint";
    hitpoint_view.graphics.beginFill("black").drawRect(-(monster.size*1), -monster.size-10, monster.size*2, 10);
    view.addChild(hitpoint_view);

    monster.body = body;
    monster.body.actor = monster;
    monster.view = view;

    return monster;
  },

  canMakeMonster: function(data) {
    return true;
  }
}
