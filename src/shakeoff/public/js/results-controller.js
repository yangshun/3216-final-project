function ResultsController($scope, $timeout) {

	var effect = 'shake';
	$scope.apple_image_class = {'brand-logo': true, 'animated': true, effect: false };
	$scope.apple_count = 0;
	$scope.android_image_class = {'brand-logo': true, 'animated': true, effect: false };
	$scope.android_count = 0;

	$scope.update_count = function(type) {
		switch (type) {
			case 'apple':
			default:
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
	}

}