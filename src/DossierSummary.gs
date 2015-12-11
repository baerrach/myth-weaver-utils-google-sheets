var MINIMUM_SKILL_LEVEL = 7;

/**
Fill the SUMMARY_SHEET (created if needed) with a summary of the DOSSIER_SHEET.
*/
function createDossierSummary() {
  var dossiersSheet = DOSSIERS_SHEET.sheet,
      summarySheet = SUMMARY_SHEET.sheet,
      skillName,
      minimumSkillLevel,
      maximumSkillLevel,
      characterNames,
      characterSkill,
      summaries = {},
      summary,
      deficiencies = [],
      dossiers,
      values;
 
  summarySheet.activate();
  
  // Get a copy of the dossier values
  dossiers = dossiersSheet.getDataRange().getValues();
  characterNames = dossiers[0];
    
  minimumSkillLevel = MINIMUM_SKILL_LEVEL;
  for (var i=0; i < characterNames.length; i++) {
    summaries[characterNames[i]] = [];
  }
       
  for (var row=DOSSIERS_SHEET.firstDataRow-1; row < dossiers.length; row++) {
    skillName = dossiers[row][0];
    maximumSkillLevel = dossiers[row][1];
    if (maximumSkillLevel < minimumSkillLevel) {
      deficiencies.push(skillName + " +" + maximumSkillLevel);
    }
    
    // Loop through each character
    for (var column=DOSSIERS_SHEET.column.firstCharacter-1; column < dossiers[row].length; column++) {
      characterSkill = dossiers[row][column];
      if (characterSkill >= minimumSkillLevel) {
        summaries[characterNames[column]] = [].concat(summaries[characterNames[column]], skillName + " +" + characterSkill);
      }
    }
  }
  
  // summaries includes the first two columns of the dossiers; "Skill" and "Max" which are not needed on the summary sheet.
  delete summaries[characterNames[DOSSIERS_SHEET.column.skill-1]];
  delete summaries[characterNames[DOSSIERS_SHEET.column.max-1]];
  characterNames = characterNames.slice(2);
  
  // arrange the data into the format needed for insertion
  values = [];
  for (var i=0; i < characterNames.length; i++) {
    values[i] = [characterNames[i], summaries[characterNames[i]].sort().join(", ")];
  }

  summarySheet.getRange(SUMMARY_SHEET.firstDataRow, 1, values.length, 2).setValues(values);
  summarySheet.getRange(SUMMARY_SHEET.firstDataRow + values.length + 1, 1, 1, 2).setValues([ ["Deficiencies", deficiencies.join(", ")] ]);
}
