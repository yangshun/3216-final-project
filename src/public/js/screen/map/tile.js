TILE_WIDTH = 30;
TILE_HEIGHT = 30;

var Tile = function(x, y, r, c) {
	CollidableObject.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#ffffff";

	this.view = null;
	this.dead = false;
};

Tile.prototype = new CollidableObject();
Tile.prototype.constructor = Tile;

Tile.prototype.initShape = function(c) {
	this.color = c || this.color;

	this.view = new createjs.Shape();
	this.view.graphics.beginFill(this.color).drawRect(this.x, this.y, TILE_WIDTH, TILE_HEIGHT);
	game.stage.addChild(this.view);
};


Tile.prototype.destroy = function() {
	game.map.removeAndReplaceTile(this);
};

Tile.prototype.tick = function() {
	if (this.dead) {
		this.destroy();	
	}
};

var ObstacleTile = function(x, y, r, c) {
	Tile.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#ffffff";

	this.view = null;
	this.body = null;
	this.dead = false;
	this._type = 'tile_obstacle';
};

ObstacleTile.prototype = new Tile();
ObstacleTile.prototype.constructor = ObstacleTile;

ObstacleTile.prototype.initBody = function() {
	var fixture = new b2FixtureDef();
	fixture.set_density(1);
	fixture.set_restitution(0.0);
	fixture.set_friction(1.0);
	
	var shape = new b2PolygonShape();
	shape.SetAsBox(TILE_WIDTH / 2 / SCALE, TILE_HEIGHT / 2 / SCALE);
	fixture.set_shape(shape);

	var bodyDef = new b2BodyDef();
	var position = new Vector2D(this.x + TILE_WIDTH / 2, this.y+TILE_HEIGHT / 2);
	// bodyDef.set_type(Box2D.b2_dynamicBody);
	bodyDef.set_type(Box2D.b2_staticBody);
	bodyDef.set_position(position.tob2Vec2(SCALE));

	var body = game.box.CreateBody(bodyDef);
	body.CreateFixture(fixture);

	this.body = body;
	this.body.actor = this;
};

ObstacleTile.prototype.collide = function(anotherObject) {
};

var RoundObstacleTile = function(x, y, r, c) {
	ObstacleTile.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#ffffff";

	this.view = null;
	this.body = null;

	this.hitpoint = 3;
	this.dead = false;
};

RoundObstacleTile.prototype = new ObstacleTile();
RoundObstacleTile.prototype.constructor = RoundObstacleTile;

RoundObstacleTile.prototype.initShape = function(c) {
	this.color = c || this.color;

	this.view = new createjs.Shape();
	this.view.graphics.beginFill(this.color).drawCircle(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 2, TILE_WIDTH / 2);
	game.stage.addChild(this.view);
};

RoundObstacleTile.prototype.initBody = function() {
	var fixture = new b2FixtureDef();
	fixture.set_density(1);
	fixture.set_restitution(0.0);
	fixture.set_friction(1.0);
	
	var shape = new b2CircleShape();
	shape.set_m_radius(TILE_WIDTH / 2 / SCALE);
	fixture.set_shape(shape);

	var bodyDef = new b2BodyDef();
	var position = new Vector2D(this.x + TILE_WIDTH / 2, this.y+TILE_HEIGHT / 2);
	bodyDef.set_type(Box2D.b2_staticBody);
	bodyDef.set_position(position.tob2Vec2(SCALE));

	var body = game.box.CreateBody(bodyDef);
	body.CreateFixture(fixture);

	this.body = body;
	this.body.actor = this;
};

RoundObstacleTile.prototype.collide = function(other) {
	if (other instanceof Shuriken) {
		this.hitpoint -= other.damage;
	}

	if (this.hitpoint <= 0) {
		this.dead = true;
	}
};
