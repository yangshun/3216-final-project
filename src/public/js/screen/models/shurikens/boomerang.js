Boomerang.prototype = new Shuriken();
Boomerang.prototype.constructor = Boomerang;

Boomerang.prototype.tick = function() {
  // Angle is 0 at 12 o'clock and clockwise
  var x = this.body.GetLinearVelocity().get_x();
  var y = this.body.GetLinearVelocity().get_y();
  var angle = Math.atan(Math.abs(y) / Math.abs(x));
  if (y < 0) {
    if (x > 0) {
      angle = Math.PI / 2 - angle;
    } else {
      angle = Math.PI * 2 - (Math.PI / 2 - angle);
    }
  } else {
    if (x > 0) {
      angle = Math.PI / 2 + angle;
    } else {
      angle = Math.PI + (Math.PI / 2 - angle);
    }
  }

//  this.last_tick =  Math.max(this.last_tick * 0.80, 0.003) || 0.03;
//  var mag = this.last_tick * Math.sqrt(x*x + y*y);
  var mag = 0.003 * Math.sqrt(x*x + y*y);

  var newX = mag * Math.cos(angle);
  var newY = mag * Math.sin(angle);

  this.body.ApplyLinearImpulse(new b2Vec2(newX, newY), this.body.GetPosition());
  this.view.x = this.body.GetPosition().get_x() * SCALE;
  this.view.y = this.body.GetPosition().get_y() * SCALE;
  this.view.rotation += this.rotation_step;
  if (this.dead || outside(this.view.x, this.view.y)) {
    this.destroy();
  }
};
