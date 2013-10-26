var ShurikenGun = function(ninja) {
  GameObject.call(this);
  this.ninja = ninja;

  this.shuriken = {
  	damage: 1,
  	color : this.ninja.color;
  	speed : 110,
  	size  : 1,
  }
}

ShurikenGun.prototype = new GameObject();
ShurikenGun.prototype.constructor = ShurikenGun;

ShurikenGun.prototype.makeShuriken = function(angle) {
	_.
}