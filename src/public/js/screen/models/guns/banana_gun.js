var BananaGun = function(ninja, view) {
  ShurikenGun.call(this, ninja, view);
  this.delay = 200;
  this.shuriken = Banana;
}

BananaGun.prototype = new ShurikenGun();
BananaGun.prototype.constructor = BananaGun;