function PlayerController($scope, $timeout) {
  $scope.row_value = '';
  $scope.col_value = '';
  $scope.board_value = '';

  $scope.submitResponse = function() {
    socket.emit('submit-response', { 
      row: $scope.row_value, 
      col: $scope.col_value, 
      board_value: $scope.board_value });
  }
}

