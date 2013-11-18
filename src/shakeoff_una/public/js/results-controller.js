function ResultsController($scope, $timeout) {
  var effect = 'shake';
  $scope.apple_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.apple_count = 0;
  $scope.android_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.android_count = 0;

  UnaScreen.register('', {name: 'screen'}, function(res) {
    if (res.success) {
      $scope.apple_count = res.state.apple;
      $scope.android_count = res.state.android;
      $scope.$apply();
    }
  });

  UnaScreen.onServerInput('game', function(data) {
    $scope.update_count(data.payload);
  });

  UnaScreen.onServerInput('reset', function(data) {
    $scope.apple_count = 0;
    $scope.android_count = 0;
    $scope.$apply();
  });

  $scope.update_count = function(type) {
    switch (type) {
      case 'apple':
        $scope.apple_count++;
        $scope.apple_image_class[effect] = true;
        $timeout(function() {
          $scope.apple_image_class[effect] = false;
        }, 500);
        break;
      case 'android':
        $scope.android_count++;
        $scope.android_image_class[effect] = true;
        $timeout(function() {
          $scope.android_image_class[effect] = false;
        }, 500);
        break;
    }
    $scope.$apply();
  };
}

var resetScores = function(password) {
  UnaScreen.sendToServer('reset', password);
}