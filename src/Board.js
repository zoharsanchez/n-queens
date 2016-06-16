// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    col: function(colIndex) {
      var board = this.rows();
      return _.zip(...board)[colIndex];
    },

    cols: function() {
      var board = this.rows();
      return _.zip(...board);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      return this.get(rowIndex).reduce(function(prev, curr) {
        return prev + curr;
      }, 0) > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var that = this;
      return this.rows().reduce(function(curr, prev, index) {
        return curr || that.hasRowConflictAt(index);
      }, false);
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      return this.col(colIndex).reduce((result, current) => {
        return result + current;
      }, 0) > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      return this.cols().reduce((result, current, index) => {
        return result || this.hasColConflictAt(index);
      }, false);
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var colIndex   = majorDiagonalColumnIndexAtFirstRow,
      rowIndex       = 0,
      count          = 0,
      boardSize      = this.get('n');
      while (boardSize > 0) {
        if (this._isInBounds(rowIndex, colIndex)){
          count += this.get(rowIndex)[colIndex];
        } 
        rowIndex++;
        colIndex++;
        boardSize--;
      }
      return count > 1;
    },    

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      if (this.get('n') === 0) {
        return false;
      };
      return this.majorTop() || this.majorBottom();
    },

    majorBottom: function() {
      var rowIndex = this.get('n') - 1,
      colIndex     = 0,
      count        = 0;
      for (var i = rowIndex; i >= 0; i--) {
        console.log("row,col",i,colIndex);
        console.log("count", count);
        if (count > 1) {
          return true;
        }
        // if (i !== rowIndex && colIndex !== 0) {
          var majorDiagonalColumnIndexAtFirstRow = this._getFirstRowColumnIndexForMajorDiagonalOn(i, colIndex);
          console.log(majorDiagonalColumnIndexAtFirstRow);
          if (!this.hasMajorDiagonalConflictAt(majorDiagonalColumnIndexAtFirstRow) 
            // && colIndex !== 0 && i !== rowIndex
            ) {
            count++;
          }
        // }
      }
      return false;
    },

    majorTop: function() {
      var rowIndex = 0,
      colIndex     = this.get('n') - 2,
      count        = 0;
      for (var i = colIndex; i <= colIndex; i++) {
        if (count > 1) {
          return true;
        }
        // if (i !== rowIndex && colIndex !== 0) {
          var majorDiagonalColumnIndexAtFirstRow = this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, i);
          if (!this.hasMajorDiagonalConflictAt(majorDiagonalColumnIndexAtFirstRow) 
            // && rowIndex !== 0 && i !== colIndex
            ) {
            count++;
          }
        // }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
