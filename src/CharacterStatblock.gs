function abilityScores(character) {
  var line = [],
      ability,
      abilityKey;
  for (abilityKey in character.abilities) {
    ability = character.abilities[abilityKey];
    line.push("[B]" + ability.name + "[/B] " + ability.value + " (" + toModifier(ability.getAbilityScoreModifier()) + ")");
  }              
  return line.join(" ");
}

function ac(character) {
  var line = [];    
  line.push("[B]AC[/B] " + character.ac);
  line.push("[B]Touch[/B] " + character.acTouch);
  line.push("[B]Flat-footed[/B] " + character.acFlatFooted);
  return line.join(" ");
}

function basicStatblock(character) {
  var line,
      lines = [];
  lines.push(name(character) + " (" + generatedBy() + ")");
  lines.push(overview(character));
  
  line = [];
  line.push(hp(character));
  line.push(movement(character));
  line.push(initiative(character));
  line.push(concentration(character));
  lines.push(line.join(" "));
  
  lines.push(ac(character));
  lines.push(savingThrows(character));   
  lines.push(combat(character));
  lines.push(abilityScores(character));
  lines.push(weapons(character));
  lines.push("");
  
  return lines.join("\n");
}

function classFeatures(classFeaturesForStatblock) {
  var classdb,
      classFeature,
      classes = {},
      tmp = [],
      lines = [];
  
  classdb = CLASS_DB_SHEET.sheet.getDataRange().getValues();
  classdb.name = CLASS_DB_SHEET.name;
  
  for (var i=0; i < classFeaturesForStatblock.length; i++) {
    classFeature = classFeaturesForStatblock[i];
    if (!classes[classFeature.class]) {
      classes[classFeature.class] = [];
    }
    
    classes[classFeature.class].push(
      oocWithSelection([classFeature.class, classFeature.feature].join(": "),
                       classFeature.selection,
                       lookupInDb(classdb,
                                  [{ column: CLASS_DB_SHEET.column.class-1, value: classFeature.class },
                                   { column: CLASS_DB_SHEET.column.feature-1, value: classFeature.feature }],
                                  [CLASS_DB_SHEET.column.description-1]
                                 )
                      )
    );
  }
  
  if (Object.keys(classes).length) {
    Object.keys(classes).sort().map(function (c) {
      lines.push("[B][U]" + c + " Features[/U][/B]: " + classes[c].join(", "));
      lines.push("");
    });
  }
  else {
    lines.push("[B][U]Class Features[/U][/B]: No {Class} values found");
    lines.push("");
  }
  
  return lines.join("\n");
}

function concentration(character) {
  if (0 !== character.concentration.value) {
    return "[B]Concentration[/B] " + character.concentration.toString();    
  }
  return "";
}

function combat(character) {
  var line = [];
  line.push("[B]BAB[/B] " + toModifier(character.bab));
  line.push("[B]CMB[/B] " + character.cmb);
  line.push("[B]CMD[/B] " + character.cmd);
  return line.join(" ");
}

function additionalInformation(character) {
  return character.additionalInformation;
}

function dailies(dailiesForStatblock) {
  var lines = [],
      tmp = [],
      daily;
  
  if (dailiesForStatblock.length != 0) {
    lines.push("[B][U]Dailies[/U][/B]:");

    for (var i=0; i < dailiesForStatblock.length; i++) {
      daily = dailiesForStatblock[i];
      tmp = [];
      tmp.push("[B]" + daily.name + "[/B]: ");
      tmp.push(daily.used + " used");
      tmp.push(" /");
      tmp.push(daily.available + " available");
      if (daily.notes) {
        tmp.push(" ");
        tmp.push(daily.notes);
      }
      lines.push(tmp.join(""));
    }
  }
  lines.push("");
  return lines.join("\n");
}

function feats(featsForStatblock) {
  var featsdb,
      feat,
      f, 
      tmp = [],
      lookup,
      lines = [];
  
  featsdb = FEATS_DB_SHEET.sheet.getDataRange().getValues();
  featsdb.name = FEATS_DB_SHEET.name;
  
  for (var i=0; i < featsForStatblock.length; i++) {
    feat = featsForStatblock[i];
    tmp.push(oocWithSelection([feat.type, feat.name].join(": "), 
                              feat.selection,
                              lookupInDb(featsdb, 
                                         [{ column: FEATS_DB_SHEET.column.type-1, value: feat.type },
                                          { column: FEATS_DB_SHEET.column.name-1, value: feat.name }],
                                         [FEATS_DB_SHEET.column.description-1,
                                          "\n\n",
                                          "[B]Benefit[/B]: ",
                                          FEATS_DB_SHEET.column.benefit-1]
                                        )
                             )
            );
  }
  
  if (tmp.length === 0) {
    tmp.push("No {Feat} values found");
  }
  
  lines.push("[B][U]Feats[/U][/B]: " + tmp.join(", "));
  lines.push("");
  
  return lines.join("\n");
}

/**
Character features for statblock inclusion are marked by enclosing them in {}s.
The format is {Class:Class Name:Class Feature<:Selection>}}
Where selection is the choice if there are multiple options (and is optional)

e.g.
{Class:Investigator:Weapon and Armor Proficiency}
{Class:Investigator:Investigator Talent:3rd Level Alchemist Discovery (Ex)}
*/
function getClassFeaturesForStatblock(feats) {
  var candidates,
      parts,
      classFeature,
      classFeatureForStatblock = [];
  
  candidates = feats.filter(function (t) {
    return startsWith(t, "{Class:");
  });
  
  for (var i=0; i < candidates.length; i++) {
    parts = candidates[i].slice(1, -1).split(":");
    
    classFeature = {};
    classFeature.class = parts[1];
    classFeature.feature = parts[2];
    classFeature.selection = parts[3];    
    
    classFeatureForStatblock.push(classFeature);
  }
  
  return classFeatureForStatblock;
}

/**
Dailes for statblock inclusion are marked by enclosing them in {}s.
The format is {Daily:Name:used/available:<Notes>}
Where notes is optional.
*/
function getDailiesForStatblock(feats) {
  var candidates,
      parts,
      daily,
      dailiesForStatblock = [];
  
  candidates = feats.filter(function (t) {
    return startsWith(t, "{Daily:");
  });
  
  for (var i=0; i < candidates.length; i++) {
    parts = candidates[i].slice(1, -1).split(":");
    
    daily = {};
    daily.name = parts[1];
    daily.notes = parts[3];
    parts = parts[2].split("/");
    daily.used = parts[0];
    daily.available = parts[1];
    
    dailiesForStatblock.push(daily);
  }
  
  return dailiesForStatblock;  
}

/**
Feats for statblock inclusion are marked by enclosing them in {}s.
The format is {Feat:Type:Name<:Selection>}}
Where selection is the choice if there are multiple options (and is optional)

e.g.
{Feat:Combat:Improved Intiative}
*/
function getFeatsForStatblock(feats) {
  var candidates,
      parts,
      feat,
      featsForStatblock = [];
  
  candidates = feats.filter(function (t) {
    return startsWith(t, "{Feat:");
  });
  
  for (var i=0; i < candidates.length; i++) {
    parts = candidates[i].slice(1, -1).split(":");
    
    feat = {};
    feat.type = parts[1];
    feat.name = parts[2];
    feat.selection = parts[3];
    
    featsForStatblock.push(feat);
  }
  
  return featsForStatblock;
}

/**
Traits for statblock inclusion are marked by enclosing them in {}s.
The format is {Trait:Type:Category:Name<:Selection>}}
Where selection is the choice if there are multiple options (and is optional)

e.g.
{Trait:Basic:Magic:Arcane Temper}
{Trait:Campaign:Kingmaker:Noble Born:Lebeda}
*/
function getTraitsForStatblock(feats) {
  var candidates,
      parts,
      trait,
      traitsForStatblock = [];
  
  candidates = feats.filter(function (t) {
    return startsWith(t, "{Trait:");
  });
  
  for (var i=0; i < candidates.length; i++) {
    parts = candidates[i].slice(1, -1).split(":");
    
    trait = {};
    trait.type = parts[1];
    trait.category = parts[2];
    trait.name = parts[3];
    trait.selection = parts[4];    
    
    traitsForStatblock.push(trait);
  }
  
  return traitsForStatblock;
}

/**
Spellbook for statblock inclusion are marked by enclosing them in {}s.
The format is {Spellbook:Class:Url}
Where the Url should be the particular post within a myth-weavers thread that lists what is included in the spellbook.

e.g.
{Spellbook:Wizard:http://www.myth-weavers.com/showthread.php?p=10563270#post10563270}
*/
function getSpellbookForStatblock(feats) {
  var candidates,
      parts,
      spellbook,
      spellbooksForStatblock = [];
  
  candidates = feats.filter(function (t) {
    return startsWith(t, "{Spellbook:");
  });
  
  for (var i=0; i < candidates.length; i++) {
    parts = candidates[i].slice(1, -1).split(":");
    
    spellbook = {};
    spellbook.class = parts[1];
    spellbook.url = parts.slice(2).join(":"); // urls contain : which is used in the split, so need to rejoin them.
    
    spellbooksForStatblock.push(spellbook);
  }
  
  return spellbooksForStatblock;  
}

function hp(character) {
  return "[B]HP[/B] " + character.hp + "/" + character.maxHp;
}

function initiative(character) {
  return "[B]Init[/B] " + character.initiative.toString();
}

function languages(character) {
  var lines = [];
  
  lines.push("[B][U]Languages[/U][/B]: " + character.languages.join(", "));
  lines.push("");
  
  return lines.join("\n");
}

function movement(character) {
  var line = [];
  if (character.movement.move) {
    line.push("[B]Speed[/B] " + character.movement.move + "ft");
  }
  if (character.movement.fly) {
    line.push("[B]Fly[/B] " + character.movement.fly + "ft");
  }
  if (character.movement.swim) {
    line.push("[B]Swim[/B] " + character.movement.swim + "ft");
  }
  if (character.movement.burrow) {
    line.push("[B]Burrow[/B] " + character.movement.burrow + "ft");
  }
  return line.join(" ");
}

function name(character) {
  return "[URL=" + SHEET_URL_STUB + character.id + "][B][SIZE=+1]" + character.name + "[/SIZE][/B][/URL]";
}

function overview(character) {
  var line = []
  line.push(character.race);
  line.push(character.class);
  line.push(character.alignment);
  return "[I]" + line.join(" ") + "[/I]";
}

function savingThrows(character) {
  var line = [],
      savingThrow,
      savingThrowKey;
  for (savingThrowKey in character.savingThrows) {
    savingThrow = character.savingThrows[savingThrowKey];
    line.push("[B]" + savingThrow.name + "[/B] " + savingThrow.toString());
  }              
  return line.join(" ");
}

function traits(traitsForStatblock) {    
  var traitsdb,
      traits,
      tmp,
      lookup,
      lines = [];
  
  function isRacialTrait(t) {
    return "Racial" === t.type;
  }
  
  function isDrawbackTrait(t) {
    return "Drawback" === t.type;
  }
  
  function traitStablock(trait) {
    return oocWithSelection([trait.type, trait.category,trait.name].join(":"), 
                            trait.selection, 
                            lookupInDb(traitsdb, 
                                       [{ column: TRAITS_DB_SHEET.column.type-1, value: trait.type },
                                        { column: TRAITS_DB_SHEET.column.category-1, value: trait.category },
                                        { column: TRAITS_DB_SHEET.column.name-1, value: trait.name }],
                                       [TRAITS_DB_SHEET.column.description-1]
                                      ));
  }      
  
  traitsdb = TRAITS_DB_SHEET.sheet.getDataRange().getValues();
  traitsdb.name = TRAITS_DB_SHEET.name;
  
  traits = traitsForStatblock.filter(function (t) {
    return isRacialTrait(t);
  });
  tmp = [];
  for (var i=0; i < traits.length; i++) {
    tmp.push(traitStablock(traits[i]));
  }
  if (tmp.length === 0) {
    tmp.push("No {Trait:Racial} values found");
  }
  lines.push("[B][U]Racial Traits[/U][/B]: " + tmp.join(", "));
  lines.push("");
  
  traits = traitsForStatblock.filter(function (t) {
    return !isRacialTrait(t) && !isDrawbackTrait(t);
  });
  tmp = [];    
  for (var i=0; i < traits.length; i++) {
    tmp.push(traitStablock(traits[i]));
  }
  if (tmp.length === 0) {
    tmp.push("No {Trait} values found");
  }
  lines.push("[B][U]Traits[/U][/B]: " + tmp.join(", "));
  lines.push("");
  
  traits = traitsForStatblock.filter(function (t) {
    return isDrawbackTrait(t);
  });
  tmp = [];    
  for (var i=0; i < traits.length; i++) {
    tmp.push(traitStablock(traits[i]));
  }
  if (tmp.length === 0) {
    tmp.push("None");
  }
  lines.push("[B][U]Drawbacks[/U][/B]: " + tmp.join(", "));
  lines.push("");
  
  return lines.join("\n");
}

function spellbook(spellbooksForStatblock) {
  var line,
      lines = [],
      spellbook;
  
  if (spellbooksForStatblock.length) {
    for (var i=0; i < spellbooksForStatblock.length; i++) {
      spellbook = spellbooksForStatblock[i];
      line = [];
      line.push("[B][U]Spellbook[/U][/B]: ");
      line.push("[URL=");
      line.push(spellbook.url);
      line.push("]");
      line.push(spellbook.class);
      line.push(" Spellbook[/URL]");
      lines.push(line.join(""));
    }
    lines.push("");
  }
  
  return lines.join("\n");
}  

/**
See Character.addSpells() for data structure of spells.
*/
function spells(character) {
  var lines = [], 
      spell,
      spellDescriptionPrefix,
      spellDescription,
      spellDescriptions,
      spellName,
      spellSchool,
      spells,
      classNames,
      className,
      classSpells,
      currentLevelSpells,
      preparation,
      usedTotal;
  
  spells = character.spells;
  if (spells) {
    lines.push("[B][U]Spells[/U][/B]: ");
    classNames = Object.keys(spells).sort();
    for (var classNameIndex=0; classNameIndex < classNames.length; classNameIndex++) {
      className = classNames[classNameIndex];
      classSpells = spells[className];
      preparation = classSpells.preparation;
      if (preparation) {
        lines.push("[B]" + className + " (" + classSpells.type + " " + preparation + ")[/B]");
      }
      for (var spellLevel=0; spellLevel < classSpells.length; spellLevel++) {
        currentLevelSpells = classSpells[spellLevel];
                
        spellDescriptions = [];
        usedTotal = 0;
        for (var i=0; i < currentLevelSpells.length; i++) {
          spell = currentLevelSpells[i];
          usedTotal += parseInt(spell.cast, 10) || 0;
          spellDescription = [];
          spellName = spell.name
          if (spell.note) {
            spell.name += " " + spell.note;
          }
          if (CASTER_PREPARATION_PREPARED === preparation) {
            if (!spell.memorized) {
              // ignore non memorized spells
              continue;
            }
            spellDescription.push(spell.cast);
            spellDescription.push("used");
            spellDescription.push("/" + spell.memorized);
            spellDescription.push("available");
          }
          else if (CASTER_PREPARATION_SPONTANEOUS === preparation) {
            spellDescription.push(spell.cast);
            spellDescription.push("used");
          }
          else {
            spellDescription.push(spell.cast);
          }
          spellDescription.push("[B]" + spell.name + "[/B]");
          if (spell.school) {
            spellSchool = [];
            spellSchool.push("[I]");
            spellSchool.push(spell.school);
            if (spell.subschool) {
              spellSchool.push(" (" + spell.subschool + ")");
            }
            if (spell.descriptor) {
              spellSchool.push(" [" + spell.descriptor + "]");
            }
            spellSchool.push("[/I]");
            spellDescription.push(spellSchool.join(""));
          }
          
          spellDescriptions.push(spellDescription.join(" "));
        }
        
        /*
        If Spells:Preparation:Prepared
        e.g. Wizard
        [B]Level 0[/B] (DC 14) Spells per day [OOC="Infinite"]Cantrips[/OOC]: used -/- available [B]Light[/B], used -/- available [B]Mage Hand[/B], used -/- available [B]Prestidigitation[/B]
        [B]Level 1[/B] (DC 15) Spells per day [OOC="3"]+1 Level, +1 Int Mod, +1 Arcane School[/OOC]: used 0/1 available [B]Color Spray[/B], used 0/1 available [B]Grease[/B], used 0/1 available [B]Mage Armor (Arcane School)[/B]
        
        If Spells:Preparation:Spontaneous
        e.g. Hunter
        [B]Level 1[/B] (DC 13) Spells per day [OOC="Infinite"]Orisons[/OOC]: [B]Light Detect Magic[/B], [B]Create Water[/B], [B]Light[/B], [B]Guidance[/B], [B]Stabilize[/B]
        [B]Level 1[/B] (DC 14) Spells per day [OOC="3"]+2 Level, +1 Wis Mod[/OOC] used 1: used 1 [B]Gravity Bow[/B], [B]Longstrider[/B], [B]Resist Energy[/B], [/B]Summon Natures Ally I[/B]
        When value in number used, then that counts towards daily total.
        */
        spellDescriptionPrefix = [];
        spellDescriptionPrefix.push("[B]" + className + " Level ");
        spellDescriptionPrefix.push(spellLevel);
        spellDescriptionPrefix.push("[/B] ");
        spellDescriptionPrefix.push("(DC ");
        spellDescriptionPrefix.push(currentLevelSpells.dc);
        spellDescriptionPrefix.push(") ");
        spellDescriptionPrefix.push("Spells per day ");
        spellDescriptionPrefix.push(currentLevelSpells.perDay);
        if (currentLevelSpells.bonus) {
          spellDescriptionPrefix.push(", Bonus spells ");
          spellDescriptionPrefix.push(currentLevelSpells.bonus);
        }
        if (CASTER_PREPARATION_SPONTANEOUS === preparation) {
          spellDescriptionPrefix.push(", used ")
          spellDescriptionPrefix.push(usedTotal)
        }
        spellDescriptionPrefix.push(": ");
        
        lines.push(spellDescriptionPrefix.join(""));
        lines.push("  " + spellDescriptions.join("\n  "));
      }
      
      lines.push("");  
    }
  }
  return lines.join("\n");
}   

function trainedSkills(character) {
  var tmp,
      lines = [];
  
  tmp = character.getTrainedSkills();
  tmp = tmp.map(function (d) {
    return d.name + " " + d.toString();
  });
  
  lines.push("[B][U]Trained Skills:[/U][/B]\n" + tmp.join(", "));
  lines.push("");
  
  return lines.join("\n");
}

function untrainedSkills(character) {
  var tmp,
      lines = [];
  
  tmp = character.getUntrainedSkills();
  tmp = tmp.map(function (d) {
    return d.name + " " + d.toString();
  });
  
  lines.push("[B][U]Untrained Skills:[/U][/B]\n" + tmp.join(", "));
  lines.push("");  
  
  return lines.join("\n");
}

function unusableSkills(character) {
  var tmp,
      lines = [];
  
  tmp = character.getUnusableSkills();
  tmp = tmp.map(function (d) {
    return d.name + " " + d.toString();
  });
  lines.push("[B][U]Unusable:[/U][/B]\n" + tmp.join(", "));
  lines.push("");
  
  return lines.join("\n");
}  

function weapons(character) {
  var line,
      weaponBlock = [],
      weapons,
      weapon,
      tmp;
  
  weapons = character.weapons;
  for (var i=0; i < weapons.length; i++) {
    weapon = weapons[i];
    // [B][special> <name>[/B] <attack bonus> (<damage>, <crit>)
    line = [];
    tmp = [];
    if (weapon.special) {
      tmp.push(weapon.special);
    }
    tmp.push(weapon.name);
    line.push("[B]" + tmp.join(" ") + "[/B]");
    
    line.push(weapon.bonus);
    
    tmp = [];
    tmp.push("(");
    tmp.push(weapon.damage);
    tmp.push(",");
    tmp.push(weapon.crit);
    tmp.push(")");
    line.push(tmp.join(""));
    
    weaponBlock.push(line.join(" "));
  }
  
  return weaponBlock.join("\n");
}

/**
When the active cell contains a Myth Weaver sheet Id, then fill the STATBLOCK_SHEET with 
a generated statblock for that character.
*/
function createStatblock() {
  var sheetId,
      json,
      character,
      row,
      characterIndex,
      statblock = [],
      statblockSheet = STATBLOCK_SHEET.sheet,
      featsForStatblock,
      traitsForStatblock,
      classFeaturesForStatblock,
      dailiesForStatblock,
      spellbookForStatblock,
      range;
  
  function addToStatblock(s) {
    if (s && s.length) {
      statblock.push(s);
    }
  }
  
  if (!validateActiveSheetIs(CHARACTERS_SHEET)) {
    return;
  }
  // Creating a stat block requires the latest character sheet data, not a cache.
  updateCharacterSheetData();
  
  // Use the current range, to get the sheetId
  range = SpreadsheetApp.getActiveRange();
  characterIndex = range.getRow();
  sheetId = range.getSheet().getRange(characterIndex, 1).getValue();
  if (!validateSheetId(characterIndex, sheetId)) {
    return;
  }
  // adjust character row index, to be column for use on statblock (by removing any header rows)
  characterIndex -= CHARACTERS_SHEET.firstDataRow - 1;
  
  json = getCharacterJSON(sheetId);
  character = parseCharacter(json);
  
  featsForStatblock = getFeatsForStatblock(character.feats);
  traitsForStatblock = getTraitsForStatblock(character.feats);
  classFeaturesForStatblock = getClassFeaturesForStatblock(character.feats);
  dailiesForStatblock = getDailiesForStatblock(character.feats);
  spellbookForStatblock = getSpellbookForStatblock(character.feats);
  
  addToStatblock(basicStatblock(character));
  
  addToStatblock(traits(traitsForStatblock));
  addToStatblock(classFeatures(classFeaturesForStatblock));
  addToStatblock(languages(character));
  addToStatblock(feats(featsForStatblock));
  addToStatblock(trainedSkills(character));
  addToStatblock(untrainedSkills(character));
  addToStatblock(unusableSkills(character));
  addToStatblock(spells(character));
  addToStatblock(spellbook(spellbookForStatblock));
  addToStatblock(dailies(dailiesForStatblock));
  addToStatblock(additionalInformation(character));
  
  statblockSheet.activate();
  statblockSheet.getRange(STATBLOCK_SHEET.headerRow, characterIndex).setFontWeight("bold").setValue(character.name);
  statblockSheet.getRange(STATBLOCK_SHEET.firstDataRow, characterIndex).setWrap(false).setValue(statblock.join("\n")).activate();
}
