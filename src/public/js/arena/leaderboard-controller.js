function LeaderboardController($scope) {
  var player_stats = function(name) {
    this.name = name;
    this.kills = 0;
    this.deaths = 0;
  };

  $scope.player_list = [];

  $scope.addPlayer = function(msg, data) {
    var person = {'name': data.name, 'kills': 0, 'deaths': 0};
    $scope.player_list.push(person);
    $scope.$parent.game_message = data.name + ' has joined the game!';
    $scope.$apply();
  };
  
  $scope.updatePlayer = function(msg, data) {
    console.log(data);
    var killer =_.findWhere($scope.player_list, {name : data.killer});
    killer.kills += 1;
    var victim = _.findWhere($scope.player_list, {name : data.victim});
    victim.deaths += 1;
    $scope.$parent.game_message = data.killer + ' just pwned ' + data.victim + '!';
    $scope.$apply();
  };

  $scope.removePlayer = function(msg, data) {
    $scope.player_list = _.filter($scope.player_list, function(p) {
      return p.name != data.name;
    });
    $scope.$parent.game_message = data.name + ' has left the game.';
    $scope.$apply();
  }

  // Subscribe to the PubSub bros!
  PubSub.subscribe('ninja.death', $scope.updatePlayer);
  PubSub.subscribe('ninja.create', $scope.addPlayer);
  PubSub.subscribe('ninja.remove', $scope.removePlayer);
};
