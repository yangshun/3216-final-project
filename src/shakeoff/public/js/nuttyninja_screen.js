// Socket registration code

var path = window.location.pathname.slice(1).split('/');
var myroom = 'lobby'; // default
if (path.length === 2 && path[1] !== '') {
	// We have a room id
	myroom = path[1];
}

socket.emit('client-register', {name: myname, type: 'screen', room: myroom });


// Box2d vars
var b2Vec2 = Box2D.b2Vec2;
var b2BodyDef = Box2D.b2BodyDef;
var b2Body = Box2D.b2Body;
var b2FixtureDef = Box2D.b2FixtureDef;
var b2Fixture = Box2D.b2Fixture;
var b2World = Box2D.b2World;
var b2PolygonShape = Box2D.b2PolygonShape;
var b2DebugDraw = Box2D.b2DebugDraw;

SCALE = 30.0;
COKE_VIEW_WIDTH = 112.0;
COKE_VIEW_HEIGHT = 182.0;

CANVAS_WIDTH = 1000.0;
CANVAS_HEIGHT = 700.0;

POWERING_DURATION = 10 * 1000;

MAX_PLAYERS = 2;


var CokeFactory = function() {
	this.free_cans = ["/images/coke.png", "/images/pepsi.png", "/images/bing.png"];	

	this.free_positions = [];
	for (var i = 0; i < this.free_cans.length; i++) {
		this.free_positions.push(200 + i * 200);
	}
}
CokeFactory.prototype.getFreeCan = function() {
	var id = Math.round(Math.random() * (this.free_cans.length - 1));
	var can = this.free_cans[id];
	this.free_cans = _.filter(this.free_cans, function(c) { return c != can; });
	return can;
}
CokeFactory.prototype.releaseCan = function(can) {
	this.free_cans.push(can);
}
CokeFactory.prototype.getFreePosition = function() {
	var id = Math.round(Math.random() * (this.free_positions.length - 1));
	var position = this.free_positions[id];
	this.free_positions = _.filter(this.free_positions, function(x) { return position != x; });
	return position;
}
CokeFactory.prototype.releasePosition = function(position) {
	this.free_positions.push(position);
}
CokeFactory.prototype.getNewCoke = function(player) {
	var can = this.getFreeCan();
	var x =  this.getFreePosition();
	return new Coke(player, can, x);
}

var Player = function(socket_id, name) {
	this.socket_id = socket_id;
	this.name = name;
	this.shake = 1;
}

var Coke = function(player, can, position) {
	this.player = player;
	this.player.can = can;

	this.view = new createjs.Bitmap(this.player.can);
	this.view.x = position;
	this.view.y = CANVAS_HEIGHT / 2;
  this.view.regX = COKE_VIEW_WIDTH / 2;
  this.view.regY = COKE_VIEW_HEIGHT / 2;
  this.initPosition = position;
  this.initX = (this.view.x + COKE_VIEW_WIDTH / 2) / SCALE;
  
  this.power = 0;

	var cokeFixture = new b2FixtureDef;
	cokeFixture.set_density(1);
	cokeFixture.set_restitution(0);
	var shape = new b2PolygonShape;
	shape.SetAsBox((COKE_VIEW_WIDTH / SCALE) / 2, (COKE_VIEW_HEIGHT / SCALE) / 2);
	cokeFixture.set_shape(shape);

	var cokeBodyDef = new b2BodyDef;
	cokeBodyDef.set_type(Box2D.b2_dynamicBody);
	cokeBodyDef.set_position(new b2Vec2((this.view.x + COKE_VIEW_WIDTH / 2) / SCALE, (this.view.y + COKE_VIEW_HEIGHT / 2) / SCALE));  // divide skin x and y by box2d scale to get right position
	this.model = game.world.CreateBody(cokeBodyDef);
	this.model.CreateFixture(cokeFixture);

	console.log(this.model.GetPosition().get_x(), this.model.GetPosition().get_x());
}
Coke.prototype.update = function() {
	// console.log(this.model.GetPosition().get_x(), this.model.GetPosition().get_x());

	var x = this.model.GetPosition().get_x() * SCALE;
	var y = this.model.GetPosition().get_y() * SCALE;

	this.view.x = x - COKE_VIEW_WIDTH / 2;
	this.view.y = y - COKE_VIEW_HEIGHT / 2;
	this.view.rotation = this.model.GetAngle() * (180 / Math.PI);
}
Coke.prototype.destroy = function() {
	console.log(stage.removeChild(this.view));
	game.world.DestroyBody(this.model);
	game.cokeFactory.releaseCan(this.player.can);
	game.cokeFactory.releasePosition(this.initPosition);
}


var Game = function() {
	this.cokeFactory = new CokeFactory();
	this.cokes = [];
	this.state = 'WAITING';
	this.world = new b2World(new b2Vec2(0.0, 10.0), true);

	// Create the ground
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	// positions the center of the object (not upper left!)
	bodyDef.set_position(new b2Vec2(CANVAS_WIDTH / 2 / SCALE, CANVAS_HEIGHT / SCALE));
	var fixDef = new b2FixtureDef;
	fixDef.set_density(1.0);
	fixDef.set_friction(0.5);
	fixDef.set_restitution(0);
	var shape = new b2PolygonShape;
	shape.SetAsBox((1200 / SCALE) / 2, (10/SCALE) / 2);
	fixDef.set_shape(shape);

	this.world.CreateBody(bodyDef).CreateFixture(fixDef);

	var background = new createjs.Shape();
	background.graphics.beginLinearGradientFill(["#000","#FFF"], [0, 1], 0, -24000, 0, 0).drawRect(0, -24000, CANVAS_WIDTH, 24000);
	stage.addChild(background);
}

Game.prototype.update = function() {
	switch (game.state) {
		case 'WAITING': 
			return
		case 'POWERING':
			return
		case 'STABILIZING':
			return

		case 'SHOOTING':
			// Does canvas transform
			maximum_offset = 0;
			game.cokes.map(function (c) {
        var y = Math.abs(c.view.y);
        var start_offset = c.view.y < (CANVAS_HEIGHT / 2);
        var screen_offset = y + CANVAS_HEIGHT / 2;
        if (start_offset && screen_offset > maximum_offset) {
					maximum_offset = screen_offset
         }
			});

			stage.setTransform(0, maximum_offset);
	}
}

Game.prototype.stabilize = function() {
	game.state = "STABILIZING";
	setTimeout(function(){ game.shoot(); }, 2000.0);
}

Game.prototype.shoot = function () {
	game.state = 'SHOOTING';

	// Apply force on all models
	game.cokes.map(function (coke) {
		var x = coke.model.GetPosition().get_x()
		var y = coke.model.GetPosition().get_y()

		coke.model.ApplyLinearImpulse(new b2Vec2(0, -coke.power), new b2Vec2(x, y))
		coke.model.SetTransform(new b2Vec2(coke.initX, y), 0);
		coke.model.SetAngularVelocity(0);
		// coke.power = 0;
	});
}

var init = function () {
	var gameCanvas = $('#gameCanvas')[0];
	context = gameCanvas.getContext('2d');
	stage = new createjs.Stage(gameCanvas);
	game = new Game();

	var scoreContainer = new createjs.Container();
	for (var i = -30; i < -5; i++) {
    var text = new createjs.Text("" + Math.abs(i * 1000), "20px Arial", "red");
    text.x = 700;
    text.y = i * 1000;
    scoreContainer.addChild(text);
   }
   stage.addChild(scoreContainer);

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', handleTick);
  // game.shoot();
}

var handleTick = function() {
	game.world.Step(
    1.0 / 60.0   //frame-rate
    ,  10       //velocity iterations
    ,  10       //position iterations
	);
	game.cokes.map(function(coke){coke.update();});
	game.update();
	stage.update();
	// game.world.ClearForces();
	// game.world.m_debugDraw.m_sprite.graphics.clear();
	game.world.ClearForces();
	// game.world.DrawDebugData();
}

var delta = 30;

// Socket Events
socket.on('controller-input', function(e) {
	if (game.state == 'POWERING') {
		if (e.action == 'shake') {
			game.cokes.map(function(coke) {
				if (coke.player.socket_id == e.id) {
					console.log(e)
					m = coke.model;
					m.ApplyAngularImpulse(100 * coke.player.shake);
					coke.player.shake *= -1;
	                var x = coke.model.GetPosition().get_x();
	                var y = coke.model.GetPosition().get_y();
	                coke.model.SetTransform(new b2Vec2(coke.initX, y), 0);

	                coke.power += Math.abs(e.key / 2.5);

					// var x = coke.model.GetPosition().get_x()
					// var y = coke.model.GetPosition().get_y()
					// m.ApplyLinearImpulse(new b2Vec2(0,Math.max(-15, -e.key)), new b2Vec2(x, y))
				}
			});
		}
	} else if (game.state == 'SHOOTING') {
        // game.cokes.map(function(coke) {
        //     if (coke.player.socket_id == e.id) {
        //         var x = coke.model.GetPosition().get_x()
        //         var y = coke.model.GetPosition().get_y()
        //         coke.model.ApplyLinearImpulse(new b2Vec2(0,Math.max(-15, -e.key)), new b2Vec2(x, y))
        //     }
        // });
	}
});

socket.on('server-controller-join', function(data) {
	if (game.state == 'WAITING') {
		var player = new Player(data.id, 'Tien');
		var coke = game.cokeFactory.getNewCoke(player);

		game.cokes.push(coke);
		stage.addChild(coke.view);
		
		if (game.cokes.length == MAX_PLAYERS) {
			game.state = 'POWERING';
			setTimeout(function() { game.stabilize() }, POWERING_DURATION);
		}

		socket.emit('screen-echo', { id: data.id, action: "join", status: { success: true, obj: player.can } });
	} else {
		socket.emit('screen-echo', { id: data.id, action: "join", status: { success: false } });
	} 
});

socket.on('server-controller-leave', function(data) 	{
	console.log('LEAVER!!!');
	console.log(data.name);
	game.cokes = _.reject(game.cokes, function(coke) {
		if(coke.player.socket_id == data.id) {
			console.log('quit');
			coke.destroy();
			return true;
		}
		return false;
	});
});

$(function() {init();});
