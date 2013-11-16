function getPath(type, num) {
  return MapConfig.tiles[type] + MapConfig.tiles[num].image;
}

var Map = function() {
  this.height = Math.floor(game.canvas.height / TILE_HEIGHT); // # of tiles
  this.width = Math.floor(game.canvas.width / TILE_WIDTH); // # of tiles

  this.tileMap = []; // keeps track of map tiles
  this.destructible = []; // keeps track of power ups
  this.blankTiles = []; // Keeps track of blank tiles
  this.asciiMap = [];

  this.numTiles = {
    healthtile: 0,
    speedtile: 0,
    guntile: 0,
    novatile: 0
  };

  this.bgpath = '/images/terrain/jungle/jungle2.jpg';
  this.background = new createjs.Bitmap(this.bgpath);
  game.stage.addChild(this.background);
};

Map.prototype.clearMap = function() {
  // Clear the tile map
  for(var i=0;i<this.tileMap.length;i++){
    for(var j=0;j<this.tileMap.length;j++){
      if (this.tileMap[i][j].view) {
        game.stage.removeChild(this.tileMap[i][j].view);
      }
      if (this.tileMap[i][j].body) {
        game.box.DestroyBody(this.tileMap[i][j].body);
      }

      delete this.tileMap[i][j];
    }

    this.tileMap[i][j] = null;
    this.tileMap[i] = null;
    delete this.tileMap[i];
  }
  delete this.tileMap;
  this.tileMap = [];

  // Clear the destructibles
  var that = this;
  _.each(this.destructible, function(t) { that.removeTile(t); });

  this.destructible = [];
  this.asciiMap = [];
  this.blankTiles = [];
}

Map.prototype.generateMap = function(id, opts, dist, tol) {
  // this.clearMap();
  if (this.asciiMap.length == 0) {
    this.decodeASCIIMap(id, opts, dist, tol);
  }

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
        var type = 4;
        //var type = Math.floor(Math.random()*6)+1;
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

Map.prototype.decodeASCIIMap = function(id, opt, dist, tol) {
  this.asciiMap = [];

  var opt = opt || 'scale';

  var ascii_map = MapConfig.ascii[id];

  var scaleX = (ascii_map[0].length-1) / this.width;
  var scaleY = (ascii_map.length-1) / this.height;

  for (var i=0;i<this.height;i++) {
    var row = [];

    for (var j=0;j<this.width;j++) {
      if (opt == 'scale') {
        var x = Math.round(j * scaleX);
        var y = Math.round(i * scaleY);
        var type = ascii_map[y][x];
      } else if (opt == 'tile') {
        var y = i % ascii_map.length;
        var x = j % ascii_map[0].length;
        var type = ascii_map[y][x];
      } else if (opt == 'round') {
        var type = '0';
      }
      row.push(type);
    }

    this.asciiMap.push(row);
  }

  var that = this;
  if (opt == 'round') {
    var distance = dist || 1.25;
    var tolerance = tol || 0.9; // 1 means follow strictly, 0 mean totally random

    var isValid = function(x, y) {
      return x>=0 && x < that.asciiMap[0].length && y>=0 && y < that.asciiMap.length;
    }

    var populate = function(x, y, type) {
      for (var dx=-distance;dx<distance;dx++) {
        for (var dy=-distance;dy<distance;dy++) {

          if (Math.round(Math.sqrt(dx*dx + dy*dy)) > distance * Math.max(Math.random(), tolerance)) {
            continue;
          }

          dx = Math.round(dx);
          dy = Math.round(dy);

          if (isValid(x+dx, y+dy)) {
            that.asciiMap[y+dy][x+dx] = type;
          }

        }
      }
    }

    for (var i=0;i<ascii_map.length;i++) {
      for (var j=0;j<ascii_map[0].length;j++) {
        if (ascii_map[i][j] !== '0') {
          var y = Math.round(i / scaleY);
          var x = Math.round(j / scaleX);
          populate(x, y, ascii_map[i][j]);
        }
      }
    }
  }
};

Map.prototype.getRandomBlankTile = function() {
  if (this.blankTiles.length == 0) {
    return false
  }
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

  if (Math.random() < 1 && this.numTiles.novatile < MapConfig.limits.novatile) {
    this.numTiles.novatile += 1;
    this.generateRandomPowerup('novatile');
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
  if (this.numTiles) {
    if (t instanceof HealthTile) {
      this.numTiles.healthtile -= 1;
    } else if (t instanceof SpeedTile) {
      this.numTiles.speedtile -= 1;
    } else if (t instanceof GunTile) {
      this.numTiles.guntile -= 1;
    } else if (t instanceof NovaTile) {
      this.numTiles.novatile -= 1;
    }
  }

  if (t) {
    this.destructible = _.without(this.destructible, t);

    if (t.body) {
      game.box.DestroyBody(t.body);
    }

    if (t.view) {
      game.stage.removeChild(t.view);
    }
  }
}

Map.prototype.generateRandomPowerup = function(type) {
  var t = this.getRandomBlankTile();
  if (t) {
    this.generatePowerup(t.tileX, t.tileY, type);
  }
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
    case 'novatile':
      p = new NovaTile(x, y, 0, getPath('powerup', 'nova'));
      p.initShape(MapConfig.tiles['nova'].w, MapConfig.tiles['nova'].h);
      break;
  }
  p.initBody();
  this.destructible.push(p);
};
