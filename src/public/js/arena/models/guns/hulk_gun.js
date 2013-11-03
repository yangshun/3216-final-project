var HulkGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 500;
  this.shuriken = HulkFist;
}

HulkGun.prototype = new ShurikenGun();
HulkGun.prototype.constructor = HulkGun;

HulkGun.prototype.makeShuriken = function(angle) {
  if (!this.checkDelay()) return false;

  var sign = 0;
  angle = angle + sign * Math.random() * this.angleRange;
  
  var cX = 70 * Math.cos(-angle) + this.ninja.size * Math.sin(-angle);
  var cY = 70 * -Math.sin(-angle) + this.ninja.size * Math.cos(-angle);
  var centerVector = new Vector2D(this.ninja.view.x + cX, this.ninja.view.y + cY);

  var s = this.shuriken.make(this.ninja, centerVector, angle);
  game.addShuriken(s);
  s.shoot();
}

