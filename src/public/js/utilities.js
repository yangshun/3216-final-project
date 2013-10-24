var   b2Vec2 = Box2D.b2Vec2
 , b2BodyDef = Box2D.b2BodyDef
 , b2Body = Box2D.b2Body
 , b2FixtureDef = Box2D.b2FixtureDef
 , b2Fixture = Box2D.b2Fixture
 , b2World = Box2D.b2World
 , b2MassData = Box2D.b2MassData
 , b2PolygonShape = Box2D.b2PolygonShape
 , b2CircleShape = Box2D.b2CircleShape;

var Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2D.prototype.tob2Vec2 = function(scale) {
  if (scale == null) scale = 1.0;
  return new b2Vec2(this.x / scale, this.y / scale);
}