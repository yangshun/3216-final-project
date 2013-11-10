function PlayerController($scope, $timeout) {
  $scope.name = ''
  $scope.row_value = 1;
  $scope.col_value = 1;
  $scope.board_value = 1;

  $scope.submitResponse = function() {
    console.log('submitResponse');
    socket.emit('submit-response', { 
      name: $scope.name,
      row: $scope.row_value, 
      col: $scope.col_value, 
      board_value: $scope.board_value 
    });
  }
}

