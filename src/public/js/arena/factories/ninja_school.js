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

    var view = new createjs.Container();
    view.x = data.position.x;
    view.y = data.position.y;

    var image_name = this.images[data.color] || this.images['yellow'];
    var body_view = new createjs.Bitmap(image_name);
    body_view.name = "body";
    body_view.scaleX = ninja.size  / (500 / 2.0);
    body_view.scaleY = ninja.size  / (500 / 2.0);
    body_view.regX = 500 / 2;
    body_view.regY = 500 / 2;
    view.addChild(body_view);

    var hitpoint_view = new createjs.Shape();
    hitpoint_view.name = "hitpoint";
    hitpoint_view.graphics.beginFill(data.color).drawRect(-(ninja.size*1.5), -ninja.size-20, ninja.size*3, 10);
    view.addChild(hitpoint_view);

    var name_view = new createjs.Text(data.player.name, "15px peachy-keen", "black");
    name_view.name = "name";
    name_view.textAlign = "center";
    name_view.x = 0;
    name_view.y = - ninja.size - 45;
    var bgw = name_view.getBounds().width + 10;
    var bgh = name_view.getBounds().height;
    var name_bg_view = new createjs.Shape();
    name_bg_view.name = "name_bg";
    name_bg_view.graphics.beginFill("white").drawRect(-bgw / 2.0, -ninja.size - bgh - 24, bgw, bgh);
    name_bg_view.alpha = 0.75;

    view.addChild(name_bg_view);
    view.addChild(name_view);

    ninja.body = body;
    ninja.body.actor = ninja;
    ninja.view = view;
    
    ninja.equipGun('none');

    ninja.ninja_shield = Shield.make(data.position.x - 15, data.position.y, 30, 7, ninja);
    return ninja;
  },

  canTrainNinja: function(color) {
    if (!_.contains(this.colors, color)) return false;
    return true;
  }
}
