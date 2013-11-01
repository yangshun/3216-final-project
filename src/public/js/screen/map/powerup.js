// ===== Powerups =====
var Powerup = function(x, y, r, c) {
	Tile.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#00ff00";

	this.heal = 10;

	this.view = null;
	this.body = null;
	this.dead = false;
	this._type = 'tile_health';
};

Powerup.prototype = new Tile();
Powerup.prototype.constructor = Powerup;

Powerup.prototype.initShape = function(c) {
	this.color = c || this.color;

	this.view = new createjs.Shape();
	this.view.graphics.beginFill(this.color).drawCircle(this.x + TILE_WIDTH / 2, this.y + TILE_HEIGHT / 2, TILE_WIDTH / 2);
	game.stage.addChild(this.view);
};

Powerup.prototype.initBody = function() {
	var fixture = new b2FixtureDef();
	fixture.set_density(1);
	fixture.set_restitution(0.0);
	fixture.set_friction(1.0);
	
	var shape = new b2PolygonShape();
	shape.SetAsBox(TILE_WIDTH / 2 / SCALE, TILE_HEIGHT / 2 / SCALE);
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

Powerup.prototype.collide = function(anotherObject) {
	this.dead = true;
};

Powerup.prototype.destroy = function() {
	game.map.removeTile(this);
};




var HealthTile = function(x, y, r, c) {
	Tile.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#00ff00";

	this.heal = 10;

	this.view = null;
	this.body = null;
	this.dead = false;
	this._type = 'tile_health';
};

HealthTile.prototype = new Powerup();
HealthTile.prototype.constructor = HealthTile;

var SpeedTile = function(x, y, r, c) {
	Tile.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = x;
	this.tileY = y;
	this.rotation = r || 0; // Rotation in degrees
	this.color = c || "#ff0000";

	this.heal = 10;

	this.view = null;
	this.body = null;
	this.dead = false;
	this._type = 'tile_speed';
};

SpeedTile.prototype = new Powerup();
SpeedTile.prototype.constructor = SpeedTile;
SpeedTile.prototype.collide = function(anotherObject) {
	if (anotherObject instanceof Ninja) {
		this.dead = true;
	}
};
