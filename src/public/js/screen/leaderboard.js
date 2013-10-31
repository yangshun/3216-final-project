var Scorebar = function(name) {
  this.name = name;
  this.kills = 0;
  this.deaths = 0;
}

var Leaderboard = {
  div: $('#leaderboard'),
  
  list: {},
  
  addPlayer: function(player_name) {
    var bar = new Scorebar(player_name);
    this.list[player_name] = bar;
    this.render();
  },
  
  updatePlayer: function(player_name, data) {
    var bar = this.list[player_name];
    if (bar == null) return false;
    bar.kills += data.kill;
    this.render();
  },

  render: function() {
    this.div = $('#leaderboard');
    this.div.empty();

    for (var player_name in this.list) {
      this.div.append('<p>' + player_name + ' ' + this.list[player_name].kills + '</p>');
    }
  }
}