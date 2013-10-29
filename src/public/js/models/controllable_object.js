var ControllableObject = function(player) {
  CollidableObject.call(this);
  this.player = player;
  if (player) {
    this.identifier = player.id;
  }
}

ControllableObject.prototype = new CollidableObject();
ControllableObject.prototype.constructor = ControllableObject;

// Handle the input from player controller
ControllableObject.prototype.handleInput = function(input) {
}