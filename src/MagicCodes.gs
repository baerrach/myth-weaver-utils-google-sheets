function createMagicCodes() {
  /*
   For selected character, read myth-weavers sheet.
   The on the Halfway House sheet create the magic codes needed for each section:
   section: Feats / Class Features / Abilities
   Race [done]
   Traits [cant do - user specific]
   Class Features [done]
   Feats [cant do - user specific]
   Dailies [cant do - user specific]

   section: Spells & Powers
   spellcasting type
   */
  var range,
      characterIndex,
      sheetId,
      json,
      character,
      halfwayHouseSheet,
      startRow,
      startColumn,
      numRows,
      ROW_WIDTH,
      classdb,
      traitsdb,
      magicCodes = [],
      values,
      race,
      classes,
      spellcasting = [];

  ROW_WIDTH = 2;

  if (!validateActiveSheetIs(CHARACTERS_SHEET)) {
    return;
  }

  // Use the current range, to get the sheetId
  range = SpreadsheetApp.getActiveRange();
  characterIndex = range.getRow();
  sheetId = range.getSheet().getRange(characterIndex, 1).getValue();
  if (!validateSheetId(characterIndex, sheetId)) {
    return;
  }
  // adjust character row index to absolute value (by removing any header rows)
  characterIndex -= CHARACTERS_SHEET.firstDataRow - 1;

  json = getCharacterJSON(sheetId);
  character = parseCharacter(json);

  classdb = CLASS_DB_SHEET.sheet.getDataRange().getValues();
  classdb.name = CLASS_DB_SHEET.name;

  traitsdb = TRAITS_DB_SHEET.sheet.getDataRange().getValues();
  traitsdb.name = TRAITS_DB_SHEET.name;

  halfwayHouseSheet = HALFWAY_HOUSE_SHEET.sheet;
  halfwayHouseSheet.activate();

  startRow = 1;
  startColumn = 1 + (characterIndex-1)*(ROW_WIDTH+1);

  numRows = halfwayHouseSheet.getLastRow();
  if (numRows) {
    range = halfwayHouseSheet.getRange(startRow, startColumn, numRows, ROW_WIDTH);
    range.clear();
  }

  range = halfwayHouseSheet.getRange(startRow, startColumn, 1, ROW_WIDTH);
  range.setFontWeight("bold");
  magicCodes.push([character.name, null]);
  range = halfwayHouseSheet.getRange(startRow, startColumn, magicCodes.length, ROW_WIDTH);
  range.setValues(magicCodes);

  startRow = magicCodes.length + 1;
  range = halfwayHouseSheet.getRange(startRow, startColumn, 1, ROW_WIDTH);
  magicCodes = [];

  race = character.race || "";
  race = race.replace(/ \(.*\)/, "");
  values = findAll(traitsdb,
                   [{ column: TRAITS_DB_SHEET.column.type-1, value: "Racial" },
                    { column: TRAITS_DB_SHEET.column.category-1, value: race }]);
  values.forEach(function(row) {
    magicCodes.push([row[TRAITS_DB_SHEET.column.type-1], row[TRAITS_DB_SHEET.column.textForSheet-1]]);
  });

  classes = character.getClasses();
  classes.forEach(function(c) {
    values = findAll(classdb,
                     [{ column: CLASS_DB_SHEET.column.class-1, value: c }]);
    values.forEach(function(row) {
      magicCodes.push([row[CLASS_DB_SHEET.column.class-1], row[CLASS_DB_SHEET.column.textForSheet-1]]);
      if ("Spells" === row[CLASS_DB_SHEET.column.feature-1] ||
          "Spell Casting" === row[CLASS_DB_SHEET.column.feature-1] ||
          "Alchemy (Su)" === row[CLASS_DB_SHEET.column.feature-1]) {
        spellcasting.push([row[CLASS_DB_SHEET.column.class-1], row[CLASS_DB_SHEET.column.textForSpellblock-1]]);
      }
    });
  });
  if (spellcasting) {
    magicCodes = magicCodes.concat(spellcasting);
  }

  range = halfwayHouseSheet.getRange(startRow, startColumn, magicCodes.length, ROW_WIDTH);
  range.setValues(magicCodes);

  halfwayHouseSheet.getRange(1, startColumn).activate();

}
