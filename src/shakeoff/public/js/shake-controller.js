function ShakeController($scope, $timeout) {
	
	$scope.chosen_image = '';
	$scope.mobile_landing_container = {'mobile-landing-container': true, 'hidden': false};
	$scope.mobile_shaking_container = {'row': true, 'shaker-container': true, 'hidden': true};
	
	var effect = 'wobble';
	$scope.brand_image_class = {'img-responsive': true, 'animated': true, effect: false}
	$scope.chooseBrand = function(type) {
		$scope.chosen_image = '/images/' + type + '-logo.png';
		console.log($scope.chosen_image);
		$scope.mobile_landing_container.hidden = true;
		$scope.mobile_shaking_container.hidden = false;
	}
	$scope.shake = function() {
		$scope.brand_image_class[effect] = true;
		$timeout(function() {
			$scope.brand_image_class[effect] = false;
			$scope.$apply();
		}, 500);
	}
}