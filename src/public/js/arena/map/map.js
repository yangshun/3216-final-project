function getPath(type, num) {
  return MapConfig.tiles[type] + MapConfig.tiles[num].image;
}

var Map = function() {
  this.height = Math.floor(game.canvas.height / TILE_HEIGHT); // # of tiles
  this.width = Math.floor(game.canvas.width / TILE_WIDTH); // # of tiles

  this.tileMap = []; // keeps track of all tiles
  this.destructible = [];
  this.blankTiles = []; // Keeps track of blank tiles
  this.asciiMap = []; 

  this.numTiles = {
    healthtile: 0,
    speedtile: 0,
    guntile: 0
  };

  this.bgpath = '/images/terrain/jungle/jungle2.jpg';
  this.background = new createjs.Bitmap(this.bgpath);
  game.stage.addChild(this.background);
};

Map.prototype.clearMap = function() {
  for(var i=0;i<this.tileMap.length;i++){
    for(var j=0;j<this.tileMap.length;j++){
      game.stage.removeChild(this.tileMap[i][j]);
    }
  }
  this.tileMap = [];
}

Map.prototype.generateMap = function(id) {
  if (this.asciiMap.length == 0) this.decodeASCIIMap(id);
  console.log(this.asciiMap);
  this.clearMap();
  console.log('height',this.height,'width',this.width);
  console.log('height',this.asciiMap.length,'width',this.asciiMap[0].length);

  for(var i=-1;i<=this.height;i++){
    var arr = [];
    for(var j=-1;j<=this.width;j++){
      if(i==-1 || j==-1 || i==this.height || j==this.width) {
        var t = new ObstacleTile(j,i,0,'#000000');
        t.initShape();
        t.initBody();
      } else if (this.asciiMap[i][j] == -1){
        continue;
      } else if (this.asciiMap[i][j] != 0) {
        var type = this.asciiMap[i][j];
        var r = Math.round(Math.random() * 4) * 90;
        var t = new TexturedObstacleTile(j,i,r,getPath('terrain', type), MapConfig.tiles[type]);
        t.initShape(MapConfig.tiles[type].w, MapConfig.tiles[type].h);
        t.initBody();
        this.destructible.push(t);
      } else {
        var t = new Tile(j,i,0);
        this.blankTiles.push(t);
      }

      arr.push(t);
    }
    this.tileMap.push(arr);
  }
}

Map.prototype.generateRandomMap = function() {
  this.clearMap();
  for(var i=-1;i<=this.height;i++){
    var arr = [];
    for(var j=-1;j<=this.width;j++){
      if(i==-1 || j==-1 || i==this.height || j==this.width) {
        var t = new ObstacleTile(j,i,0,'#000000');
        t.initShape();
        t.initBody();
      } else if (Math.random() < 0.05) {
        var type = Math.round(Math.random() * 5) + 1;
        var r = Math.round(Math.random() * 4) * 90;
        var t = new TexturedObstacleTile(j,i,r,getPath('terrain', type), MapConfig.tiles[type]);
        t.initShape(MapConfig.tiles[type].w, MapConfig.tiles[type].h);
        t.initBody();
        this.destructible.push(t);
      } else {
        var t = new Tile(j,i,0);
        this.blankTiles.push(t);
      }

      arr.push(t);
    }
    this.tileMap.push(arr);
  }
}

Map.prototype.decodeASCIIMap = function(id, opt) {
  this.asciiMap = [];

  var opt = opt || 'scale';
  var ascii_map = MapConfig.ascii[id];
  var scaleX = (ascii_map[0].length-1) / this.width;
  var scaleY = (ascii_map.length-1) / this.height;
  console.log('scalex',scaleX,'scaley',scaleY);

  for (var i=0;i<this.height;i++) {
    var row = [];
    var y = Math.round(i * scaleY);

    for (var j=0;j<this.width;j++) {
      if (opt == 'scale') {
        var x = Math.round(j * scaleX);
        
        console.log(x,y);
        var type = ascii_map[x][y];
      }
      row.push(type);
    }

    this.asciiMap.push(row);
  }
};

Map.prototype.getRandomBlankTile = function() {
  // Get a tile that has no obstacle
  var emptyTile = this.blankTiles[(Math.round(Math.random()*this.blankTiles.length))];
  return emptyTile;
}

Map.prototype.getRandomBlankPosition = function() {
  var emptyTile = this.getRandomBlankTile();
  return new Vector2D(emptyTile.x+TILE_WIDTH/2, emptyTile.y+TILE_HEIGHT/2);
}

Map.prototype.tick = function() {
  this.destructible.map(function(t) {
    t.tick();
  });

  if (Math.random()< 0.01 && this.numTiles.healthtile < MapConfig.limits.healthtile) {
    this.numTiles.healthtile += 1;
    this.generateRandomPowerup('healthtile');
  }

  if (Math.random() < 0.01 && this.numTiles.speedtile < MapConfig.limits.speedtile) {
    this.numTiles.speedtile += 1;
    this.generateRandomPowerup('speedtile');
  }

  if (Math.random() < 0.01 && this.numTiles.guntile < MapConfig.limits.guntile) {
    this.numTiles.guntile += 1;
    this.generateRandomPowerup('guntile');
  }
}

Map.prototype.removeAndReplaceTile = function(t) {
  this.removeTile(t);

  this.tileMap = _.without(this.tileMap, t);
  var new_t = new Tile(t.tileX, t.tileY, 0);
  this.tileMap.push(new_t);
  this.blankTiles.push(new_t);
  delete t;
}

Map.prototype.removeTile = function(t) {
  if (t instanceof HealthTile) {
    this.numTiles.healthtile -= 1;
  }
  if (t instanceof SpeedTile) {
    this.numTiles.speedtile -= 1;
  }
  if (t instanceof GunTile) {
    this.numTiles.guntile -= 1;
  }

  this.destructible = _.without(this.destructible, t);
  game.box.DestroyBody(t.body);
  game.stage.removeChild(t.view);
}

Map.prototype.generateRandomPowerup = function(type) {
  var t = this.getRandomBlankTile();  
  this.generatePowerup(t.tileX, t.tileY, type);
};

Map.prototype.generatePowerup = function(x, y, type) {
  var p;
  switch (type) {
    case 'healthtile':
      p = new HealthTile(x, y, 0, getPath('powerup', 'health'));
      p.initShape(MapConfig.tiles['health'].w, MapConfig.tiles['health'].h);
      break;
    case 'speedtile':
      p = new SpeedTile(x, y, 0, getPath('powerup', 'speed'));
      p.initShape(MapConfig.tiles['speed'].w, MapConfig.tiles['speed'].h);
      break;
    case 'guntile':
      p = new GunTile(x, y, 0);
      p.initShape();
      break;
  }
  p.initBody();
  this.destructible.push(p);
};
