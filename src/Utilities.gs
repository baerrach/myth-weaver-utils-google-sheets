/**
Copied from http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
Protected against undefined strings.
*/
function capitalizeFirstLetter(s) {
  if (s === undefined || s === null || s === "") {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 Copied from https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
 */
function startsWith(s, searchString, position) {
  if (s == undefined) {
    return false;
  }
  position = position || 0;
  return s.indexOf(searchString, position) === position;
}

// Given a two dimensional array, swap the dimensions.
function transpose(a){
  return a[0].map(function (_, c) { return a.map(function (r) { return r[c]; }); });
}

/**
 Find the first matching row in a database for all criteria supplied.
 criterion: {
 column: <index to match>,
 value: <value to match>
 }
 */
function find(db, criteria) {
  var row,
      match;
  return db.filter(function (row) {
    return criteria.reduce(function (p, c) {
      return p && (c.value === undefined || row[c.column] === c.value);
    }, true);
  })[0];
}

/**
 find(db, criteria), and then index the answer by the specified column..
 If the answer does not exist then return an error message.
 */
function lookupInDb(db, criteria, columns) {
  var answer;
  answer = find(db, criteria);
  if (answer) {
    return columns.map(function(column) {
      if (typeof column === 'string') {
        return column;
      }
      if (typeof column === 'number') {
        return answer[column];
      }
      return "Column must be either an index into the row, or a string to copy verbatim";
    }).join("");
  } else {
    var index = criteria.reduce(function (p, c) {
      p.push("[Column=" + c.column + ", Value=" + c.value + "]");
      return p;
    }, []).join(", ");
    return "Unable to locate " + index + " in " + db.name;
  }
}

function arrayOfZeros(length) {
  return Array.apply(null, Array(length)).map(function() {
    return 0;
  });
}
