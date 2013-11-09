function ShakeController($scope, $timeout) {
	$scope.chosen_image = '';
	$scope.mobile_landing_container = {'mobile-landing-container': true, 'hidden': false};
	$scope.mobile_shaking_container = {'row': true, 'shaker-container': true, 'hidden': true};
	
	var effect = 'wobble';
	$scope.brand_image_class = {'img-responsive': true, 'animated': true, effect: false};

  var choice = '';

	$scope.chooseBrand = function(type) {
		$scope.chosen_image = '/images/' + type + '-logo.png';
		$scope.mobile_landing_container.hidden = true;
		$scope.mobile_shaking_container.hidden = false;
    choice = type;
	};

	$scope.shake = function() {
		$scope.brand_image_class[effect] = true;
    socket.emit('shakeit', {type: choice});

		$timeout(function() {
			$scope.brand_image_class[effect] = false;
			$scope.$apply();
		}, 500);
	};
  
  var handleShake = function(eventData) {
    var a = eventData.accelerationIncludingGravity;
    if (Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z) > 60) {
      $scope.shake();
    }
  };
  window.addEventListener('devicemotion', handleShake, false);
}

