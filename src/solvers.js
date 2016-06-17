/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
// Helper func to create an empty matrix
window.makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
// Helper func to speed through array rows
var factorial = function(n) {
  if (n < 0) {
    return undefined;
  }
  if (n === 1 || n === 0) {
    return n;
  }
  return factorial(n - 1) * n;
};

window.findNRooksSolution = function(n) {
  var solution = window.makeEmptyMatrix(n);
  for (var i = 0; i < solution.length; i++) {
    solution[i][i] = 1;
  }
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var board = new Board({'n': n});
  var solutionCount = 0;
  var lastRow = n - 1;
  var tryToPlaceRook = function(rowIndex) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(rowIndex, col);
      if (!board.hasColConflictAt(col)) {
        if (rowIndex !== lastRow) {
          tryToPlaceRook(rowIndex + 1);
        } else {
          solutionCount++;
        }
      }
      board.togglePiece(rowIndex, col);
    }
  };
  tryToPlaceRook(0);
  // debugger;
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({'n': n});
  if (n === 0 || n === 2 || n === 3) {
    return board.rows();
  }
  var lastRow = n - 1;
  var tryToPlaceQueen = function(rowIndex) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(rowIndex, col);
      if (!board.hasColConflictAt(col) && !board.hasMinorDiagonalConflictAt(col + rowIndex) && !board.hasMajorDiagonalConflictAt(col - rowIndex)) {
        if (rowIndex !== lastRow) {
          var result = tryToPlaceQueen(rowIndex + 1);
          if (result) {
            return result;
          } 
        } else {
          return board.rows();
        }
      }
      board.togglePiece(rowIndex, col);
    }

    return undefined;
  };
  tryToPlaceQueen(0);
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 0) {
    return 1;
  }
  var board = new Board({'n': n});
  var solutionCount = 0;
  var lastRow = n - 1;
  var tryToPlaceQueen = function(rowIndex) {
    for (var col = 0; col < n; col++) {
      board.togglePiece(rowIndex, col);
      if (!board.hasColConflictAt(col) && !board.hasMinorDiagonalConflictAt(col + rowIndex) && !board.hasMajorDiagonalConflictAt(col - rowIndex)) {
        if (rowIndex !== lastRow) {
          tryToPlaceQueen(rowIndex + 1);
        } else {
          solutionCount++;
        }
      }
      board.togglePiece(rowIndex, col);
    }
  };
  tryToPlaceQueen(0);
  return solutionCount;
};
