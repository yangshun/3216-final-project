var ControllableObject = function(identifier) {
  CollidableObject.call(this);
  this.identifier = identifier;
}

ControllableObject.prototype = new CollidableObject();
ControllableObject.prototype.constructor = ControllableObject;

// Handle the input from player controller
ControllableObject.prototype.handleInput = function(input) {
}