// http://www.d20pfsrd.com/traits/tools/traits-db
//   -> https://docs.google.com/spreadsheets/d/1OQH-t50ZqZ-WSajGRbaALzbExij2mL-i13G_p054jig
// http://www.pathfindercommunity.net/home/databases/feats
//   -> https://docs.google.com/spreadsheets/d/1XqQO21AyE2WtLwW0wSjA9ov74A9tmJmVJjrhPK54JHQ
// http://www.pathfindercommunity.net/home/databases/spells
//   -> https://docs.google.com/spreadsheets/d/1cuwb3QSvWDD7GG5McdvyyRBpqycYuKMRsXgyrvxvLFI

function _copy(source, sheet, destination) {
  var destinationSheet,
      note = [];
   
  LOG_SHEET.sheet.activate();
  Logger.log("Copying Spreadsheet locally:");
  Logger.log("Source = " + source.getName());
  Logger.log("Sheet = " + sheet.getName());
  Logger.log("Destination = " + destination.getName());
  
  Logger.log("Started ... (please wait)");
  destinationSheet = sheet.copyTo(destination);
  Logger.log("  Copy completed.");

  _cleanse(destinationSheet.getActiveRange());

  note.push("Copied on " + new Date());
  note.push("From " + source.getUrl());
  destinationSheet.getRange(1, 1).setNote(note.join("\n"));
  destinationSheet.getRange(1, 1, 1, destinationSheet.getLastColumn()).setFontWeight("bold");

  Logger.log("Completed");

}

function copyFeatsDb() {
  var source = SpreadsheetApp.openById('1XqQO21AyE2WtLwW0wSjA9ov74A9tmJmVJjrhPK54JHQ');
  var sheet = source.getSheets()[0];
  
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  _copy(source, sheet, destination); 
}

function copySpellDb() {
  var source = SpreadsheetApp.openById('1cuwb3QSvWDD7GG5McdvyyRBpqycYuKMRsXgyrvxvLFI');
  var sheet = source.getSheets()[0];
  
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  _copy(source, sheet, destination); 
}

function copyTraitsDb() {
  var source = SpreadsheetApp.openById('1OQH-t50ZqZ-WSajGRbaALzbExij2mL-i13G_p054jig');
  var sheet = source.getSheets()[0];
  
  var destination = SpreadsheetApp.getActiveSpreadsheet();
  _copy(source, sheet, destination); 
}

