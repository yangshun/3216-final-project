var GunFactory = {
  images: { 'arc': '/images/cannon-arc.png',
            'bumblebee': '/images/cannon-bumblebee.png',
            'frost': '/images/cannon-frost.png',
            'hulk': '/images/cannon-hulk.png',
            'juggernault': '/images/cannon-juggernault.png'},

  // data: {position: Vector2D, player: Player, color: String}
  makeGun: function(data) {
    var gun_url = this.images[data.type] || this.images['bumblebee'];
    var gun_view = new createjs.Bitmap(gun_url);
    gun_view.name = "gun";
    gun_view.scaleX = GUN_WIDTH  / 623.0;
    gun_view.scaleY = GUN_HEIGHT  / 200.0;
    gun_view.regX = 623 / 2.0;
    gun_view.regY = 0;

    var gun = new ShurikenGun(data.ninja, gun_view);
    return gun;
  }
}