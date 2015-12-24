function createDiceRolls() {
  var diceRollsSheet = DICE_ROLLS_SHEET.sheet,
      characters,
      character,
      value,
      diceRolls = [],
      warnings = [];

  diceRollsSheet.activate();

  characters = CHARACTERS_SHEET.getCharacters();
  diceRolls.push("[B][U]Initiative[/B][/U]:");
  for (var i=0; i < characters.length; i++) {
    character = characters[i];
    if (character.initiative.value != character.initiative.sheetValue) {
      value = character.initiative.sheetValue;
      warnings.push(character.name + " does not have enhanced statblock commands, sheet value differs from calculated value.");
    }
    else {
      value = character.initiative.value;
    }
    diceRolls.push(character.name + ": [roll]1d20" + toModifier(value) + "z[/roll] " + character.initiative.toString());
  }

  if (warnings) {
    diceRolls = diceRolls.concat("", warnings);
  }

  diceRollsSheet.getRange(DICE_ROLLS_SHEET.firstDataRow, DICE_ROLLS_SHEET.column.diceRolls).setValue(diceRolls.join("\n"));
}
