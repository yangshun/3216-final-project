var Game = function() {
  this.map = null;
  this.ninjas = [];
  this.shurikens = [];
  this.stage = null;
  this.colors = ['yellow', 'red', 'blue', 'orange', 'purple', 'green', 'brown', 'cyan'];

  this.box = new b2World(new b2Vec2(0, 0), true);
  var listener = new b2ContactListener();

  Box2D.customizeVTable(listener, [{
      original: Box2D.b2ContactListener.prototype.PostSolve,
      replacement:
          function (thsPtr, contactPtr) {
              var contact = Box2D.wrapPointer( contactPtr, b2Contact );
              var bodyA = contact.GetFixtureA().GetBody().actor;
              var bodyB = contact.GetFixtureB().GetBody().actor;

              bodyA.collide(bodyB);
              bodyB.collide(bodyA);
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

  return true;
}

Game.prototype.removeNinja = function(s) {
  this.stage.removeChild(s.view);
  this.ninjas = _.without(this.ninjas, s);
  this.box.DestroyBody(s.body);
  this.colors.push(s.color);
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