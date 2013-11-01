function LeaderboardController($scope) {
  var player_stats = function(name) {
    this.name = name;
    this.kills = 0;
    this.deaths = 0;
  };

  $scope.player_list = [];

  $scope.addPlayer = function(msg, data) {
    console.log('addPlayer', msg,data);
    var person = {'name': data.name, 'kills': 0, 'deaths': 0};
    $scope.player_list.push(person);
    $scope.$apply();
  };
  
  $scope.updatePlayer = function(msg, data) {
    console.log('updatePlayer', msg,data);
    console.log('list', $scope.player_list);
    for (var i = 0; i < $scope.player_list.length; i++) {
      if ($scope.player_list[i].name == data.name) {
        $scope.player_list[i].kills += data.kills;
        $scope.$apply();
        return;
      }
    }
    return false;
  };

  // Subscribe to the PubSub bros!
  PubSub.subscribe('ninja.death', $scope.updatePlayer);
  PubSub.subscribe('ninja.create', $scope.addPlayer);

};
