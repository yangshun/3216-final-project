var NinjaSchool = {
  colors: ['yellow', 'red', 'blue', 'orange', 'purple', 'green', 'brown', 'cyan'],
  images: {'yellow'  : '/images/ninja-yellow.png',
            'red'    : '/images/ninja-red.png'},

  // data: {position: Vector2D, player: Player, color: String}
  trainNinja: function(data) {
    if (!this.canTrainNinja(data.color)) return false;

    var fixture = new b2FixtureDef;
    fixture.set_density(1);
    fixture.set_restitution(0);
    fixture.set_friction(1.0);
    
    var shape = new b2CircleShape();
    shape.set_m_radius(NINJA_RADIUS / SCALE);
    fixture.set_shape(shape);

    var bodyDef = new b2BodyDef;
    bodyDef.set_type(Box2D.b2_dynamicBody);
    bodyDef.set_position(data.position.tob2Vec2(SCALE));

    var body = game.box.CreateBody(bodyDef);
    body.CreateFixture(fixture);
    
    var ninja = new Ninja(data.player, data.color);
    ninja.size = NINJA_RADIUS;

    var gun = GunFactory.makeGun({ninja: ninja, type: 'bumblebee'});
    gun.view.x = 0;
    gun.view.y = NINJA_RADIUS;

    var view = new createjs.Container();
    view.x = data.position.x;
    view.y = data.position.y;

    view.addChild(gun.view);

    var image_name = this.images[data.color] || this.images['yellow'];
    var body_view = new createjs.Bitmap(image_name);
    body_view.name = "body";
    body_view.scaleX = NINJA_RADIUS  / (500 / 2.0);
    body_view.scaleY = NINJA_RADIUS  / (500 / 2.0);
    body_view.regX = 500 / 2;
    body_view.regY = 500 / 2;
    view.addChild(body_view);

    var hitpoint_view = new createjs.Shape();
    hitpoint_view.name = "hitpoint";
    hitpoint_view.graphics.beginFill(data.color).drawRect(-(NINJA_RADIUS*1.5), -NINJA_RADIUS-20, NINJA_RADIUS*3, 10);
    view.addChild(hitpoint_view);

    var name_view = new createjs.Text(data.player.name, "15px chunq", "black");
    name_view.name = "name";
    name_view.textAlign = "center";
    name_view.x = 0;
    name_view.y = - NINJA_RADIUS - 35;
    view.addChild(name_view);

    ninja.body = body;
    ninja.body.actor = ninja;
    ninja.view = view;

    return ninja;
  },

  canTrainNinja: function(color) {
    if (!_.contains(this.colors, color)) return false;
    return true;
  }
}