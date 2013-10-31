var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.stage = null;

  this.box = new b2World(new b2Vec2(0, 0), true);
  var listener = new b2ContactListener();

  Box2D.customizeVTable(listener, [{
      original: Box2D.b2ContactListener.prototype.PostSolve,
      replacement:
          function (thsPtr, contactPtr) {
              var contact = Box2D.wrapPointer( contactPtr, b2Contact );
              var bodyA = contact.GetFixtureA().GetBody().actor;
              var bodyB = contact.GetFixtureB().GetBody().actor;

              CollisionManager.collision(bodyA, bodyB);
          }
  }]);
  this.box.SetContactListener(listener);
}

Game.prototype.addNinja = function(data) {
  if (!NinjaSchool.canTrainNinja(data.ninja)) return false;

  var player = new Player(data);
  var position = this.map.getRandomBlankPosition();

  var ninja = NinjaSchool.trainNinja({
    player: player,
    position: position,
    color: data.ninja,
  });

  this.ninjas.push(ninja);
  this.stage.addChild(ninja.view);
  Leaderboard.addPlayer(player.name);

  return true;
}

Game.prototype.updateScore = function(player_kill, player_die) {
  Leaderboard.updatePlayer(player_kill, {kill: 1});
}

Game.prototype.reviveNinja = function(ninja, time) {
  this.stage.removeChild(ninja.view);
  setTimeout(function() {
    var position = game.map.getRandomBlankPosition();
    ninja.reset(position);
    game.stage.addChild(ninja.view);
  }, time);
}

Game.prototype.removeNinja = function(s) {
  this.stage.removeChild(s.view);
  this.ninjas = _.without(this.ninjas, s);
  this.box.DestroyBody(s.body);
}

Game.prototype.addShuriken = function(s) {
  this.shurikens.push(s);
  this.stage.addChild(s.view);
}

Game.prototype.removeShuriken = function(s) {
  this.stage.removeChild(s.view);
  this.shurikens = _.without(this.shurikens, s);
  this.box.DestroyBody(s.body);
}