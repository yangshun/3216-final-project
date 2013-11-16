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


// GameEndEffect Effect
var GameEndEffect = function() {
  Effect.call(this);

  this.view = new createjs.Text("Game Over", "30px peachy-keen", "black");
  this.view.textAlign = "center";
  this.view.x = 500;
  this.view.y = 200;;
  game.stage.addChild(this.view);

  this.numCalled = 0;
  this.numFrame = 120;

  var that = this;
  var GameEndEvent = function () {
    that.numCalled++;
    if (that.numCalled >= that.numFrame) {
      that.destroy();
      return;
    }
    setTimeout(GameEndEvent, 1.0 / 60);
  };
  GameEndEvent();
};

GameEndEffect.prototype = new Effect();
GameEndEffect.prototype.constructor = GameEndEffect;
GameEndEffect.prototype.destroy = function() {
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
    if (!that.ninja) return;
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

// Death effect
var DeathEffect = function(ninja) {
  Effect.call(this);
  this.view = ninja.view.getChildByName('body').clone();
  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y;
  game.stage.addChild(this.view);
  
  this.interval = 100; 
  this.numCalled = 0;
  this.numFrame = 60;

  // var sign = Math.random() > 0.5 ? 1 : -1;
  // this.deltaX = Math.random() * 20.0 * sign;
  // sign = Math.random() > 0.5 ? 1 : -1;
  // this.deltaY = Math.random() * 20.0 * sign;
  this.deltaX = 0;
  this.deltaY = -10;

  var that = this;
  var DeathEvent = function () {
    that.view.rotation += 10;
    that.view.alpha -= 0.05;
    that.view.rotation += 10;
    that.view.scaleX *= 1.1;
    that.view.scaleY *= 1.1;
    that.view.y += that.deltaY;
    that.view.x += that.deltaX;
    TimedEventManager.addEvent(1.0/that.numFrame, DeathEvent);
    that.numCalled++;
    if (that.numCalled >= that.numFrame) {
      that.destroy();
    }
  };
  DeathEvent();
};

DeathEffect.prototype = new Effect();
DeathEffect.prototype.constructor = DeathEffect;

DeathEffect.prototype.destroy = function() {
  game.stage.removeChild(this.view);
  delete this;
};

// Killer effect
var KillerEffect = function(ninja) {
  Effect.call(this);
  this.view = new createjs.Text('Killing Spree','15px peachy-keen','red');
  this.view.textAlign = 'center';
  this.deltaY = -40;

  this.view.x = ninja.view.x;
  this.view.y = ninja.view.y + this.deltaY;
  game.stage.addChild(this.view);
  
  this.interval = 100; 
  this.numCalled = 0;
  this.numFrame = 60 * 2;


  var that = this;
  var KillerEvent = function () {
    that.view.scaleX *= 1.01;
    that.view.scaleY *= 1.01;

    that.view.y = that.view.y + that.deltaY;

    TimedEventManager.addEvent(2.0/that.numFrame, KillerEvent);
    that.numCalled++;
    if (that.numCalled >= that.numFrame) {
      that.destroy();
    }
  };
  KillerEvent();
};

KillerEffect.prototype = new Effect();
KillerEffect.prototype.constructor = KillerEffect;

KillerEffect.prototype.destroy = function() {
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
