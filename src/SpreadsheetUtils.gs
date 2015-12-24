function getSheet(name) {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0; i < sheets.length; i++) {
    if (name === sheets[i].getName()) {
      return sheets[i];
    }
  }

  return SpreadsheetApp.getActiveSpreadsheet().insertSheet().setName(name);
}

/**
 Copied from http://stackoverflow.com/questions/26480857/how-do-i-replace-text-in-a-spreadsheet-with-google-apps-script
 */
function replaceInRange(range, to_replace, replace_with) {
  //get the current data values as an array
  var values = range.getValues();

  //loop over the rows in the array
  for(var row in values) {

    //use Array.map to execute a replace call on each of the cells in the row.
    var replaced_values = values[row].map(function(original_value){
      return replaceAll(original_value.toString(), to_replace ,replace_with);
    });

    //replace the original row values with the replaced values
    values[row] = replaced_values;
  }

  //write the updated values to the sheet
  range.setValues(values);
}

function _cleanse(range) {
  Logger.log("Cleansing started...");

  Logger.log("  Replacing smart quotes...");
  replaceInRange(range, "“", '"');
  replaceInRange(range, "”", '"');
  Logger.log("  Done.");

  Logger.log("  Replacing dashes... (can take 30 minutes)");
  replaceInRange(range, "–", "-");
  replaceInRange(range, "—", "-");
  Logger.log("  Done.");


  Logger.log("Cleansing Done.");
}

function cleanseActiveRange() {
  _cleanse(SpreadsheetApp.getActive().getActiveSheet().getActiveRange());
}

function cleanseCurrentSheet() {
  _cleanse(SpreadsheetApp.getActive().getActiveSheet().getDataRange());
}
