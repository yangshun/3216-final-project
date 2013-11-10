function ShakeController($scope, $timeout) {
  $scope.chosen_image = '';
  $scope.mobile_landing_container = {'mobile-landing-container': true, 'hidden': false};
  $scope.mobile_shaking_container = {'row': true, 'shaker-container': true, 'hidden': true};
  
  var effect = 'wobble';
  $scope.brand_image_class = {'img-responsive': true, 'animated': true, effect: false};

  var choice = '';

  $scope.choose_brand = function(type) {
    UnaController.register('', type, function(res) {
      if (res.success) {
        $scope.chosen_image = '/images/' + type + '-logo.png';
        $scope.mobile_landing_container.hidden = true;
        $scope.mobile_shaking_container.hidden = false;
        choice = type;
      }
    });
  };

  $scope.shake = function() {
    $scope.brand_image_class[effect] = true;
    UnaController.sendToScreen({type: choice});

    $timeout(function() {
      $scope.brand_image_class[effect] = false;
      $scope.$apply();
    }, 500);
  };
  
  var handle_shake = function(event_data) {
    var a = event_data.accelerationIncludingGravity;
    if (Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z) > 60) {
      $scope.shake();
    }
  };
  window.addEventListener('devicemotion', handle_shake, false);
}

