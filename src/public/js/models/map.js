TILE_WIDTH = 32;
TILE_HEIGHT = 32;

var Tile = function(x, y, r) {
	createjs.Container.call(this);
	this.x = x * TILE_WIDTH;
	this.y = y * TILE_HEIGHT;
	this.tileX = this.x;
	this.tileY = this.y;
	this.rotation = r || 0; // Rotation in degrees

	var shape = new createjs.Shape();
	this.drawing = shape.graphics.beginFill("#ffffff").drawRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
	this.addChild(shape);
}

Tile.prototype = new createjs.Container();
Tile.prototype.constructor = Tile;

var ObstacleTile = function(x, y, r) {
	Tile.call(this);
	this.isDestroyed = false;
}
ObstacleTile.prototype = new Tile();
ObstacleTile.prototype.constructor = ObstacleTile;

var Map = function() {
	this.height = 20; // # of tiles
	this.width = 20; // # of tiles

	this.tileMap = [];
}

Map.prototype.clearMap = function() {
	for(var i=0;i<this.tileMap.length;i++){
		for(var j=0;j<this.tileMap.length;j++){
			stage.removeChild(this.tileMap[i][j]);
		}
	}
	this.tileMap = [];
}

Map.prototype.generateSimpleMap = function() {
	this.clearMap();
	for(var i=0;i<this.height;i++){
		var arr = [];
		for(var j=0;j<this.width;j++){
			var t = new Tile(i,j,0);

			arr.push(t);
			stage.addChild(t);
		}
		this.tileMap.push(arr);
	}
}

Map.prototype.getRandomBlankPosition = function() {
	// Get a tile that has no obstacle
	var justTiles = this.tileMap.filter(function(t) {
		var notObstacle = !(t instanceof ObstacleTile)
		return notObstacle;
	});

	console.log('getBlankPosition','justTiles', justTiles);
	return justTiles[int(Math.round(Math.random()*justTile.length))];
}
