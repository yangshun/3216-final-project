var Map = function() {
	this.height = Math.floor(game.canvas.height / TILE_HEIGHT); // # of tiles
	this.width = Math.floor(game.canvas.width / TILE_WIDTH); // # of tiles

	this.tileMap = [];
	this.destructible = [];

	this.bgpath = '/images/game-background.jpg';
	this.background = new createjs.Bitmap(this.bgpath);

	game.stage.addChild(this.background);
}

Map.prototype.clearMap = function() {
	for(var i=0;i<this.tileMap.length;i++){
		for(var j=0;j<this.tileMap.length;j++){
			game.stage.removeChild(this.tileMap[i][j]);
		}
	}
	this.tileMap = [];
}

Map.prototype.generateSimpleMap = function() {
	this.clearMap();
	for(var i=-1;i<=this.height;i++){
		var arr = [];
		for(var j=-1;j<=this.width;j++){
			if(i==-1 || j==-1 || i==this.height || j==this.width) {
				var t = new ObstacleTile(j,i,0,'#000000');
				t.initShape();
				t.initBody();
			} else if (Math.random() < 0.05) {
				var t = new RoundObstacleTile(j,i,0,'#111111');
				t.initShape();
				t.initBody();
				this.destructible.push(t);
			} else {
				var t = new Tile(j,i,0);
			}
			arr.push(t);
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

Map.prototype.tick = function() {
	this.destructible.map(function(t) {
		t.tick();
	});
}

Map.prototype.removeTile = function(t) {
	this.destructible = _.without(this.destructible, t);
	game.box.DestroyBody(t.body);
	game.stage.removeChild(t.view);
	this.tileMap = _.without(this.tileMap, t);
	var new_t = new Tile(t.tileX, t.tileY, 0);
	this.tileMap.push(new_t);
	delete t;
}
