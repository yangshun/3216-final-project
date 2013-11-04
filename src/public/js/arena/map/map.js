CONFIG_MAX = {
  healthtile : 5,
  speedtile : 2,
  guntile : 5
};

CONFIG_TILES = {
  terrain: '/images/terrain/jungle/',
  powerup: '/images/powerups/',
  image: '/images/',
  1: {image:'rock.png', w: 360, h: 180, tileW: 1, tileH: 1},
  2: {image:'rock-3.png', w: 360, h: 360, tileW: 1, tileH: 1},
  3: {image:'rock-4.png', w: 360, h: 360, tileW: 1, tileH: 1},
  4: {image:'tree-2.png', w: 360, h: 345, tileW: 2, tileH: 2},
  5: {image:'hut.png', w: 600, h: 600, tileW: 2, tileH: 2},
  6: {image:'hut-2.png', w: 600, h: 600, tileW: 2, tileH: 2},
  // 8: {image:'tree.png', w: 360, h: 360},
  // 2: {image:'rock-2.png', w: 240, h: 240},
  health: {image:'first-aid-kit.png', w: 300, h: 256},
  speed: {image:'haste-boots.png', w: 300, h: 300}
};

function getPath(type, num) {
  return CONFIG_TILES[type] + CONFIG_TILES[num].image;
}

var Map = function() {
  this.height = Math.floor(game.canvas.height / TILE_HEIGHT); // # of tiles
  this.width = Math.floor(game.canvas.width / TILE_WIDTH); // # of tiles

  this.tileMap = [];
  this.destructible = [];
  this.blankTiles = []; // Keeps track of blank tiles

  this.numTiles = {
    healthtile: 0,
    speedtile: 0,
    guntile: 0
  };

  this.bgpath = '/images/game-background.jpg';
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

Map.prototype.generateMap = function() {
  if (!this.tileMap) this.generateASCIIMap();

  for(var i=-1;i<=this.height;i++){
    for(var j=-1;j<=this.width;j++){
      if(i==-1 || j==-1 || i==this.height || j==this.width) {
        var t = new ObstacleTile(j,i,0,'#000000');
        t.initShape();
        t.initBody();
      } else if (this.tileMap[i][j] != 0) {
        var t = new TexturedObstacleTile(j,i,0,getPath('terrain', 2));
        t.initShape();
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
        var t = new TexturedObstacleTile(j,i,r,getPath('terrain', type), CONFIG_TILES[type]);
        t.initShape(CONFIG_TILES[type].w, CONFIG_TILES[type].h);
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

Map.prototype.readASCIIMAP = function(opt) {
  var opt = opt || 'stretch';
  this.clearMap();
  this.tileMap = [];
  for (var i=0;i<this.height;i++) {
    var row = [];
    for (var j=0;j<this.width;j++) {
      row.append();
    }
    this.tileMap.push(row);
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

  if (Math.random()< 0.01 && this.numTiles.healthtile < CONFIG_MAX.healthtile) {
    this.numTiles.healthtile += 1;
    this.generateRandomPowerup('healthtile');
  }

  if (Math.random() < 0.01 && this.numTiles.speedtile < CONFIG_MAX.speedtile) {
    this.numTiles.speedtile += 1;
    this.generateRandomPowerup('speedtile');
  }

  if (Math.random() < 0.01 && this.numTiles.guntile < CONFIG_MAX.guntile) {
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
      p.initShape(CONFIG_TILES['health'].w, CONFIG_TILES['health'].h);
      break;
    case 'speedtile':
      p = new SpeedTile(x, y, 0, getPath('powerup', 'speed'));
      p.initShape(CONFIG_TILES['speed'].w, CONFIG_TILES['speed'].h);
      break;
    case 'guntile':
      p = new GunTile(x, y, 0);
      p.initShape();
      break;
  }
  p.initBody();
  this.destructible.push(p);
};
