var CHARACTERS_SHEET = {
  name: "Characters",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    sheetId: 1,
    characterName: 2,
    dateCopied: 3,
    lastModified: 4,
    sheetData: 5,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
CHARACTERS_SHEET.getCharacters = function ()
{
  var range = this.sheet.getDataRange(),
      characters = [];
  for (var i=this.firstDataRow; i <= range.getNumRows(); i++) {
    characters.push(parseCharacter(this.sheet.getRange(i, this.column.sheetData).getValue()));
  }
  return characters;
}
