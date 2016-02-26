function createDiceRolls() {
  var diceRollsSheet = DICE_ROLLS_SHEET.sheet,
      activeCell,
      characters,
      character,
      attribute,
      rollFor,
      value,
      diceRolls = [],
      warnings = [];

  if (!validateActiveSheetIs(DICE_ROLLS_SHEET)) {
    return;
  }

  characters = CHARACTERS_SHEET.getCharacters();
  activeCell = SpreadsheetApp.getActive().getActiveSheet().getActiveCell();
  rollFor = activeCell.getValue();

  diceRolls.push("[B][U]" + rollFor + "[/B][/U]:");
  for (var i=0; i < characters.length; i++) {
    character = characters[i];
    if (character[rollFor]) {
      attribute = character[rollFor];
    }
    else if (character.skills[rollFor]) {
      attribute = character.skills[rollFor];
    }
    else if (character.savingThrows[rollFor.toLowerCase()]) {
      attribute = character.savingThrows[rollFor.toLowerCase()];
    }
    else {
      attribute = undefined;
    }
    if (attribute) {
      if (attribute.value != attribute.sheetValue) {
        value = attribute.sheetValue;
        warnings.push(character.name + " does not have enhanced statblock commands, sheet value differs from calculated value.");
      }
      else {
        value = attribute.value;
      }
      diceRolls.push(character.name + ": [roll]1d20" + toModifier(value) + "z[/roll] " + attribute.toString());
    }
    else {
      warnings.push("Character does not have attribute, saving throw, or skill " + rollFor);
    }
  }

  if (warnings) {
    diceRolls = diceRolls.concat("", warnings);
  }

  activeCell = activeCell.offset(0, 1);
  activeCell.setValue(diceRolls.join("\n"));
  activeCell.activate();
}
