/**
Using the characters from CHARACTER_SHEET, create a dossier of skills.
Unknown skills will be auto-included into the skill column.
 */
function createDossierOfSkills() {
  var charactersSheet = CHARACTERS_SHEET.sheet,
      dossierSheet = DOSSIERS_SHEET.sheet,
      allCells = dossierSheet.getDataRange().getValues(),
      knownSkills,
      characters = CHARACTERS_SHEET.getCharacters(),
      character,
      skills,
      skillName,
      skill,
      skillRow,
      skillCells;

  knownSkills = [].concat.apply([], transpose(allCells)[DOSSIERS_SHEET.column.skill-1].slice(DOSSIERS_SHEET.firstDataRow));
  knownSkills = knownSkills.filter(function (d) {
    return d;
  });
  
  dossierSheet.activate();
  for (var i=0; i < characters.length; i++) {
    character = characters[i];
    skills = character.skills;
    skillCells = arrayOfZeros(Math.max(MAX_SKILLS, knownSkills.length));
    
    for (skillName in skills) {
      skill = skills[skillName];
      skillRow = findSkillRow(knownSkills, skill.name);
      // Always use the sheet value, not the calculate value for dossier of skills.
      skillCells[skillRow] = skill.sheetValue;
    }
    
    // write character name
    dossierSheet.getRange(DOSSIERS_SHEET.headerRow, DOSSIERS_SHEET.column.firstCharacter+i).setValue(character.name);  

    // write skill values
    var values = transpose([skillCells])
    dossierSheet.getRange(DOSSIERS_SHEET.firstDataRow, DOSSIERS_SHEET.column.firstCharacter+i, skillCells.length, 1).setValues(values);

    // rewrite knownSkills
    values = transpose([knownSkills]);
    dossierSheet.getRange(DOSSIERS_SHEET.firstDataRow, DOSSIERS_SHEET.column.skill, knownSkills.length, 1).setValues(values);
  }
}

function findSkillRow(knownSkills, skill) {
  var length=knownSkills.length,
      currentSkill;
  // Unknown skills will be inserted into the first empty slot, or at the end, of the knownSkills array  
  for (var i=0; i < length; i++) {
    currentSkill = knownSkills[i]
    if ("" === currentSkill) {
      knownSkills[i] = skill;
      return i;
    }
    if (skill.toUpperCase() === currentSkill.toUpperCase()) {
      return i;
    }
  }

  knownSkills.push(skill);
  return knownSkills.length-1;
}
