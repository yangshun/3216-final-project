var ShurikenGun = function(ninja) {
  GameObject.call(this);
  this.ninja = ninja;
}

ShurikenGun.prototype = new GameObject();
ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.makeShuriken = function() {
}