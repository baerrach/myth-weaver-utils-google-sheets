function onInstall(e) {
//  Logger.log("onInstall AuthMode=" + e.authMode);
  onOpen(e);
}

function onOpen(e) {
  Logger.log("onOpen AuthMode=" + e.authMode);
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Myth-Weavers')
  .addItem('Get current character sheet data ("Characters:active row")', 'updateCharacterSheetData')
  .addItem('Get all character sheet data (using all "Characters:Sheet Id")', 'updateAllCharacterSheetData')
  .addItem('Create dossier of skills', 'createDossierOfSkills')
  .addItem('Create dossier summary (using all "Characters")', 'createDossierSummary')
  .addItem('Create GM dice roll bbcodes (using all "Characters")', 'createDiceRolls')
  .addItem('Create encumbrance for character ("Characters:active row")', 'createEncumbrance')
  .addItem('Create statblock for character ("Characters:active row")', 'createStatblock')
  .addToUi();
  
  ui.createMenu('Data Cleansing')
  .addItem('Cleanse selected region', 'cleanseActiveRange')
  .addItem('Cleanse current sheet (can take 30 minutes)', 'cleanseCurrentSheet')
  .addToUi();
}
