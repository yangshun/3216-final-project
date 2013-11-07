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



// Heal Effect

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

// Blink effect

var BlinkEffect = function(ninja) {
  Effect.call(this);
  this.ninja = ninja;
  this.interval = 100;
  this.oldCollide = ninja.collide;
  ninja.collide = function(){};

  var that = this;
  var BlinkEvent = function () {
    that.interval *= 0.9;
    that.ninja.view.alpha = 1 - that.ninja.view.alpha;

    if (that.interval > 1) {
      TimedEventManager.addEvent(that.interval, BlinkEvent);
    } else {
      that.ninja.removeEffect(that);
      that.ninja.view.alpha = 1;
      that.ninja.collide = that.oldCollide;
      that.destroy();
    }
  };
  BlinkEvent();
};

BlinkEffect.prototype = new Effect();
BlinkEffect.prototype.constructor = BlinkEffect;
BlinkEffect.prototype.tick = function (ninja) {
//  this.ninja.view.alpha = 1 - this.ninja.view.alpha;
};

BlinkEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  game.stage.removeChild(this.view);
  delete this;
};

// Speed Effect
var SpeedEffect = function(ninja, change, minimum, duration) {
  Effect.call(this);
  this.ninja = ninja;
  this.start = (new Date()).getTime();
  this.duration = duration || Infinity;

  var old = ninja.speed;
  ninja.speed = Math.max(minimum, ninja.speed + change);
  this.real_change = old - ninja.speed;
};

SpeedEffect.prototype = new Effect();
SpeedEffect.prototype.constructor = SpeedEffect;
SpeedEffect.prototype.tick = function (ninja) {
  if ((new Date()).getTime() - this.start > this.duration) {
    this.remove();
    this.destroy();
  }
};

SpeedEffect.prototype.remove = function() {
  this.ninja.speed += this.real_change;
};

SpeedEffect.prototype.destroy = function() {
  this.ninja.removeEffect(this);
  delete this;
};
