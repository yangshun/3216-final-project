var Effect = function() {
  GameObject.call(this);
  this.view = null;
  this._type = 'effect';

  this.dead = false;
};

Effect.prototype = new GameObject();
Effect.prototype.constructor = Effect;

Effect.prototype.tick = function () {
};






var HealEffect = function(ninja) {
  Effect.call(this);
  this.ninja = ninja;

  var image = new Image();
  image.src = 'images/flame5x36x64.png';

  var spriteSheet = new createjs.SpriteSheet({
    // image to use
    images: [image],
    frames: { width: 36, height: 64, regX: 18, regY: 32},
    animations: {
      heal: [0,4, 'heal', 2]
    }
  });
  spriteSheet.framerate = 10;
  
  this.view = new createjs.Sprite(spriteSheet, 'heal');
  this.view.regX = 0;
  this.view.regY = 0;

  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y;

  game.stage.addChild(this.view);
};

HealEffect.prototype = new Effect();
HealEffect.prototype.constructor = HealEffect;
HealEffect.prototype.tick = function (ninja) {
  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y;
  this.view.alpha -= 0.01;
};
HealEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  game.stage.removeChild(this.view);
  delete this;
};
