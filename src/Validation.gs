function validateActiveSheetIs(sheet) {
  if (sheet.name !== SpreadsheetApp.getActive().getActiveSheet().getName()) {
    var ui = SpreadsheetApp.getUi();
    ui.alert('Error', 'This menu item must be run on the sheet "' + sheet.name + '"', ui.ButtonSet.OK);
    return false;
  }
  return true;
}

function validateSheetId(rowNumber, sheetId) {
  if (! parseInt(sheetId, 10)) {
    var ui = SpreadsheetApp.getUi();
    ui.alert('Error', 'Row ' + rowNumber + ' does not contain a valid sheet id:"' + sheetId + '"', ui.ButtonSet.OK);
    return false;
  }
  return true;
}
