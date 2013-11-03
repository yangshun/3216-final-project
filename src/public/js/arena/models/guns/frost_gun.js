var FrostGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 200;
  this.shuriken = SnowFlake;
}

FrostGun.prototype = new ShurikenGun();
FrostGun.prototype.constructor = FrostGun;

FrostGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

  var sign = Math.random() > 0.5 ? 1.0 : -1.0;
  angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = 40 * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = 40 * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle);
  game.addShuriken(s);
  s.shoot();
}