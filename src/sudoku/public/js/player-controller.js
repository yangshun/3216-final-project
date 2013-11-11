function PlayerController($scope, $timeout) {
  
  $scope.name = '';
  $scope.row_value = 0;
  $scope.col_value = 0;
  $scope.selected_value = 0;
  $scope.board = [];
  $scope.nums = [];

  function generateModel() {
    var board = 
    [['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']];
    for (var i = 0; i < 9; i++) {
      var row = [];
      for (var j = 0; j < 9; j++) {
        row.push({ 'row_num': i, 'col_num': j, 'sudoku-col': true, 'blue-bg': false });
      }
      $scope.board.push(row);
    }
    var nums = [1,2,3,4,5,6,7,8,9];
    for (var i = 0; i < nums.length; i++) {
      $scope.nums.push({'class': {'btn': true, 'btn-default': true, 'blue-bg': false}, 'value': nums[i]});
    }
  }
  generateModel();

  $scope.selectSquare = function(square) {
    for (var i = 0; i < $scope.board.length; i++) {
      for (var j = 0; j < $scope.board[i].length; j++) {
        $scope.board[i][j]['blue-bg'] = false;
      }
    }
    console.log(square)
    $scope.row_value = square.row_num + 1;
    $scope.col_value = square.col_num + 1; 
    $scope.board[square.row_num][square.col_num]['blue-bg'] = true;
  }

  $scope.selectValue = function(index) {
    for (var i = 0; i < $scope.nums.length; i++) {
      $scope.nums[i].class['blue-bg'] = false;
    }
    $scope.nums[index].class['blue-bg'] = true;
    $scope.selected_value = index + 1;
  }

  $scope.submitResponse = function() {
    console.log('submitResponse');
    if ($scope.row_value == 0 || $scope.col_value == 0) {
      alert('Please select a box!');
      return;
    }
    if ($scope.selected_value == 0) {
      alert('Please select a value!');
      return;
    }
  
    socket.emit('submit-response', { 
      name: $scope.name,
      row: $scope.row_value, 
      col: $scope.col_value, 
      board_value: $scope.selected_value 
    });
    for (var i = 0; i < $scope.nums.length; i++) {
      $scope.nums[i].class['blue-bg'] = false;
    }
    $scope.selected_value = 0;
  }
}

window.addEventListener('load', function() {
  FastClick.attach(document.body);
}, false);
