function BoardController($scope, $timeout) {

  $scope.board = 
  [[1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9]];


  var effect = 'shake';
  $scope.apple_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.apple_count = 0;
  $scope.android_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.android_count = 0;

  socket.on('welcome', function(data) {
    $scope.apple_count = data.apple_count;
    $scope.android_count = data.android_count;
    $scope.$apply();
  });

  socket.on('results', function(data) {
    $scope.apple_count = data.apple_count;
    $scope.android_count = data.android_count;
    $scope.update_count(data.type);
  });

  $scope.update_count = function(type) {
    console.log('update count for', type);
    switch (type) {
      case 'apple':
        $scope.apple_image_class[effect] = true;
        $timeout(function() {
          $scope.apple_image_class[effect] = false;
        }, 500);
        break;
      case 'android':
        $scope.android_image_class[effect] = true;
        $timeout(function() {
          $scope.android_image_class[effect] = false;
        }, 500);
        break;
    }
    $scope.$apply();
  };

}
