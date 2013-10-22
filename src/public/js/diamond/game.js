var Game = function(canvas_id) {
    this.canvas_id = canvas_id;
};

Game.prototype.init = function() {
    var orange = new Player(0, "orange");
    var red = new Player(1, "red");

    var stage = new createjs.Stage(this.canvas_id);
    this.stage = stage;

    red.x = 400;
    red.y = 200;

    orange.x = 200;
    orange.y = 200;

    this.stage.addChild(orange);
    this.stage.addChild(red);
    this.stage.update();

    createjs.Ticker.addEventListener("tick", stage);
}