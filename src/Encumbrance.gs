// TODO: https://github.com/baerrach/myth-weaver-utils-google-sheets/issues/2
// For each location listed, sum up the weights
// All chaining for weight calculations; e.g. item -> backpack, backpack -> worn = item included in worn calculation.
function createEncumbrance() {
  var encumbranceSheet,
      character,
      characterIndex,
      encumbrance = [],
      json,
      item,
      range,
      sheetId,
      numRows,
      startRow,
      startColumn;

  if (!validateActiveSheetIs(CHARACTERS_SHEET)) {
    return;
  }

  // Use the current range, to get the sheetId
  range = SpreadsheetApp.getActiveRange();
  Logger.log("Active range = " + range.getSheet().getName() + "@" + range.getRow() + "," + range.getColumn());
  characterIndex = range.getRow();
  sheetId = range.getSheet().getRange(characterIndex, 1).getValue();
  if (!validateSheetId(characterIndex, sheetId)) {
    return;
  }
  // adjust character row index to absolute value (by removing any header rows)
  characterIndex -= CHARACTERS_SHEET.firstDataRow - 1;

  json = getCharacterJSON(sheetId);
  character = parseCharacter(json);

  encumbranceSheet = ENCUMBRANCE_SHEET.sheet;
  encumbranceSheet.activate();

  startRow = 1;
  startColumn = 1 + (characterIndex-1)*4;
  encumbranceSheet.getRange(startRow, startColumn).activate();

  numRows = encumbranceSheet.getLastRow();
  if (numRows) {
    range = encumbranceSheet.getRange(startRow, startColumn, numRows, 3);
    range.clear();
  }

  range = encumbranceSheet.getRange(startRow, startColumn, 3, 3);
  range.setFontWeight("bold");
  encumbrance.push([character.name, null, null]);
  encumbrance.push(["Containers", null, null]);
  encumbrance.push(["Name", "Weight", null]);
  for (var containerKey in character.containers) {
    item = character.containers[containerKey];
    encumbrance.push([containerKey, item.weight, null]);
  }
  range = encumbranceSheet.getRange(1, startColumn, encumbrance.length, 3);
  range.setValues(encumbrance);

  startRow = encumbrance.length + 2;
  range = encumbranceSheet.getRange(startRow, startColumn, 1, 3);
  range.setFontWeight("bold");
  encumbrance = [];
  encumbrance.push(["Name", "Weight", "Location"]);
  for (var i=0; i < character.equipment.length; i++) {
    item = character.equipment[i];
    encumbrance.push([item.name, item.weight, item.location]);
  }
  range = encumbranceSheet.getRange(startRow, startColumn, encumbrance.length, 3);
  range.setValues(encumbrance);
}
