function BoardController($scope, $timeout) {

  var board = 
 [['', '', 1, '', '', 2, '', '', 4],
  [4, '', '', '', 7, '', '', '', ''],
  ['', '', '', '', 1, 4, '', '', ''],
  [5, 8, '', 2, '', '', '', '', ''],
  ['', '', '', 8, '', '', 3, '', ''],
  [9, '', '', '', '', 5, '', 6, ''],
  [1, '', 9, '', '', '', 2, '', ''],
  ['', '', '', 9, '', '', 8, '', ''],
  [2, 5, '', '', '', 7, '', '', 9]];

  // template
  // [['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', ''],
  // ['', '', '', '', '', '', '', '', '']];
  $scope.board = [];

  function generateBoard() {
    for (var i = 0; i < board.length; i++) {
      var row = [];
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] != '') {
          row.push({ fixed: true, value: board[i][j], 'sudoku-col': true, 'blue-bg': false });
        } else {
          row.push({ fixed: false, value: board[i][j], 'sudoku-col': true, 'blue-bg': false });
        }
      }
      $scope.board.push(row);
    }
  }

  function checkSolve() {
    // check all rows
    for (var i = 0; i < $scope.board.length; i++) {
      var row_nums = _.map($scope.board[i], function(item) { return item.value != '' ? item.value : 0; });
      var row_sum = _.reduce(row_nums, function(memo, num) { return memo + num; }, 0);
      if (row_sum != 45) {
        return false;
      }
    }

    // check all cols
    for (var i = 0; i < $scope.board.length; i++) {
      var col_nums = _.map($scope.board, function(item) { return item[i].value != '' ? item[i].value : 0; });
      var col_sum = _.reduce(col_nums, function(memo, num) { return memo + num; }, 0);
      if (col_sum != 45) {
        return false;
      }
    }

    // check all 3x3
    for (var i = 0; i < 3; i++) {
      // actually dont need check la hor
    }

    alert('Puzzle solved!');
  }

  generateBoard();
  
  $scope.logs = [];

  var effect = 'shake';
  $scope.apple_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.apple_count = 0;
  $scope.android_image_class = {'brand-logo': true, 'animated': true, effect: false };
  $scope.android_count = 0;

  socket.on('welcome', function(data) {
    // $scope.apple_count = data.apple_count;
    // $scope.android_count = data.android_count;
    // $scope.$apply();
  });

  socket.on('update-board', function(data) {
    console.log('update board message');
    if (!$scope.board[data.row-1][data.col-1].fixed) {
      $scope.board[data.row-1][data.col-1].value = data.board_value;
      $scope.board[data.row-1][data.col-1]['blue-bg'] = true;
      $timeout(function() {
        $scope.board[data.row-1][data.col-1]['blue-bg'] = false;
        $scope.$apply();
      }, 1000);
      $scope.logs.splice(0, 0, data);
      $scope.$apply();
      checkSolve();
    } else {
      console.log('Cannot update fixed cell');
    }
  });

  $scope.get_square = function(data) {
    var ref = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    return ref[data.col-1] + data.row;
  }

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
