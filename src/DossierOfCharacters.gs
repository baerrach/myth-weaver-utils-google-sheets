function _updateCharacterSheetData(range) {
  var character,
      data,
      json,
      row,
      sheetId,
      timestamp;

  // Use the current range, to reset the range to the current row, columns 1 to 4.
  range = range.getSheet().getRange(range.getRow(), CHARACTERS_SHEET.column.sheetId, 1, CHARACTERS_SHEET.column.lastModified);
  data = range.getValues();

  timestamp = new Date();

  row = data[0];
  sheetId = row[0];
  if (! validateSheetId(range.getRow(), sheetId)) {
    return;
  }
  json = getCharacterJSON(sheetId);
  character = JSON.parse(json);
  row[1] = character.name;
  row[2] = timestamp;
  row[3] = character.updated_at;
  row[4] = json;

  // Write the data back to the spreadsheet
  range = range.offset(0, 0, range.getNumRows(), range.getNumColumns()+1);
  range.setValues(data);

  // Set the dateCopied and lastModified column number formats over the range provided
  range.offset(0, CHARACTERS_SHEET.column.dateCopied-1, range.getNumRows(), 1).setNumberFormat("d/M/yyyy hh:mm:ss");
  range.offset(0, CHARACTERS_SHEET.column.lastModified-1, range.getNumRows(), 1).setNumberFormat("d/M/yyyy hh:mm:ss");
}

/**
 Update the active row on the CHARACTERS_SHEET sheet, with the data from myth-weavers:
 Sheet Id, Character Name, Date Copied, Last Modified, Sheet Data
 */
function updateCharacterSheetData() {
  if (!validateActiveSheetIs(CHARACTERS_SHEET)) {
    return;
  }

  _updateCharacterSheetData(SpreadsheetApp.getActive().getActiveSheet().getActiveCell());
}

/**
 Update all CHARACTERS_SHEET rows
 */
function updateAllCharacterSheetData() {
  var charactersSheet = CHARACTERS_SHEET.sheet,
      range = charactersSheet.getDataRange();
  for (var i=CHARACTERS_SHEET.firstDataRow; i <= range.getNumRows(); i++) {
    _updateCharacterSheetData(range.offset(i-1, 0));
  }
}
