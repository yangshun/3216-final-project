var GunFactory = {
  images: { 'arc': '/images/cannon-arc.png',
            'bumblebee': '/images/cannon-bumblebee.png',
            'frost': '/images/cannon-frost.png',
            'hulk': '/images/cannon-hulk.png',
            'juggernaut': '/images/cannon-juggernaut.png',
            'plasma': '/images/cannon-plasma.png'},

  // data: {position: Vector2D, player: Player, color: String}
  makeGun: function(data) {
    var gun_view;
    if (data.type == 'none') {
      gun_view = new createjs.Shape();
      gun_view.name = "gun";
    } else {
      var gun_url = this.images[data.type] || this.images['bumblebee'];
      gun_view = new createjs.Bitmap(gun_url);
      gun_view.name = "gun";
      gun_view.scaleX = GUN_WIDTH  / 623.0;
      gun_view.scaleY = GUN_HEIGHT  / 200.0;
      gun_view.regX = 623 / 2.0;
      gun_view.regY = -(data.ninja.size - GUN_HEIGHT) / gun_view.scaleY;
    }

    var gun; 
    switch (data.type) {
      case 'arc':
        gun = new ArcGun(data.ninja, gun_view);
        break;
      case 'hulk':
        gun = new HulkGun(data.ninja, gun_view);
        break;
      case 'juggernaut':
        gun = new JuggernautGun(data.ninja, gun_view);
        break;
      default:
        gun = new ShurikenGun(data.ninja, gun_view);
    }
    return gun;
  },

  allGunTypes: function() {
    return _.keys(this.images);
  },

  gunImage: function(gun_type) {
    return this.images[gun_type];
  }
};
