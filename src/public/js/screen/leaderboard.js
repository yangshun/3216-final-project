var Scorebar = function(name) {
  this.name = name;
  this.kills = 0;
  this.deaths = 0;
};

var Leaderboard = (function() {
  this.div = $('#leaderboard');
  this.list = {};

  var render = function() {
    this.div = $('#leaderboard');
    this.div.empty();
    var player_name;

    for (player_name in this.list) {
      this.div.append('<p>' + player_name + ' ' + this.list[player_name].kills + '</p>');
    }
  };

  var addPlayer = function(msg, data) {
    console.log('addPlayer',msg,data);
    var bar = new Scorebar(data.name);
    this.list[data.name] = bar;
    render();
  };
  
  var updatePlayer = function(msg, data) {
    console.log('updatePlayer',msg,data);
    console.log('list', this.list);
    var bar = this.list[data.name];
    if (bar === null) return false;
    bar.kills += data.kills;
    render();
  };

  // Subscribe to the PubSub bros!
  PubSub.subscribe('ninja.death', updatePlayer);
  PubSub.subscribe('ninja.create', addPlayer);

})();
