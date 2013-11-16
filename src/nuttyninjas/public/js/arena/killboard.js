function Kill(data, x, y) {
  this.killer = data.killer;
  this.weapon = data.weapon;
  this.victim = data.victim;
  console.log('kill',data);

  var view = new createjs.Container();
  view.x = x || 0;
  view.y = y || 0;

  var killerview = this.killer.view.clone();
  console.log('killerview',killerview);
  // killerview.getChildByName('body').rotation = 0;

  var victimview = this.victim.view.clone();
  console.log('victimview',victimview);
  // victimview.getChildByName('body').rotation = 0;

  var weaponview = this.weapon.view.clone();
  console.log('weaponview',weaponview);
  weaponview.rotation = 0;

  view.addChild(killerview);
  view.addChild(victimview);
  view.addChild(weaponview);

  this.view = view;

  this.width = 300;
  this.height = 200;
}


var KillBoard = (function() {
  var x = 0;
  var kill_list = [];

  var push = function (data) {
    // Figure out where to add this
    var last_y = 0;
    if (kill_list.length > 0) {
      last_y = kill_list[kill_list.length-1].view.y + Kill.height;
    }

    // Add this last kill onto the list
    var k = new Kill(data, x, last_y);
    kill_list.push(k);
    console.log('new kills: ', k);
  };

  var pop = function() {
    // Move everyone up
  };

  return {push: push, pop: pop};
})();

PubSub.subscribe('ninja.death', function(msg, data) {
  KillBoard.push(data);
});
