function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  Logger = BetterLog.useSpreadsheet(); // Fixes Issue #69
  Logger.log("onOpen AuthMode=" + e.authMode);
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Myth-Weavers')
    .addItem('Help Documentation', 'openHelpDialog')
    .addSeparator()
    .addItem('Create GM dice roll bbcodes for skill("Dice Rolls:active cell")', 'createDiceRolls')
    .addSeparator()
    .addItem('Get current character sheet data ("Characters:active row")', 'updateCharacterSheetData')
    .addItem('Get all character sheet data (using all "Characters:Sheet Id")', 'updateAllCharacterSheetData')
    .addItem('Create dossier of skills', 'createDossierOfSkills')
    .addItem('Create dossier summary (using all "Characters")', 'createDossierSummary')
    .addItem('Create encumbrance for character ("Characters:active row")', 'createEncumbrance')
    .addItem('Create myth-weaver sheet magic codes ("Characters:active row")', 'createMagicCodes')
    .addItem('Create statblock for all characters (using all "Characters")', 'createAllCharactersStatblock')
    .addItem('Create statblock for character ("Characters:active row")', 'createStatblock')
    .addToUi();

  ui.createMenu('Data Cleansing')
    .addItem('Cleanse selected region', 'cleanseActiveRange')
    .addItem('Cleanse current sheet (can take 30 minutes)', 'cleanseCurrentSheet')
    .addToUi();
}

function openHelpDialog() {
  var html = HtmlService.createHtmlOutput('<a target="_blank" href="https://github.com/baerrach/myth-weaver-utils-google-sheets/wiki">Help Documentation</a> (opens in a new window)')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi()
    .showModalDialog(html, 'Myth Weaver Utilities Help Documentation');
}
