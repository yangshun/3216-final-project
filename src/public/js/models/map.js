TILE_WIDTH = 32;
TILE_HEIGHT = 32;

var Tile = function(x, y, r) {
	this.x = x;
	this.y = y;
	this.canvasX = this.x * TILE_WIDTH;
	this.canvasY = this.y * TILE_HEIGHT;
	this.rotation = r || 0; // Rotation in degrees
	createjs.Container.call(this);
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
	this.tileMap = [];
}

Map.prototype.generateSimpleMap = function() {
	this.clearMap();
	for(var i=0;i<this.height;i++){
		var arr = [];
		for(var j=0;j<this.width;j++){
			arr.push(new Tile(i,j,0));
		}
		this.tileMap.push(arr);
	}
}

Map.prototype.getBlankPosition = function() {
	// Get a tile that has no obstacle or ninja in collision with it
	var justTiles = this.tileMap.filter(function(t) {
		var notObstacle = !(t instanceof ObstacleTile)
		var noNinja = ; // TODO : Use easeljs hit test
		return notObstacle && noNinja;
	});
	console.log('getBlankPosition','justTiles', justTiles);
	return justTiles[int(Math.round(Math.random()*justTile.length))];
}
