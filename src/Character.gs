var CASTER_PREPARATION_SPONTANEOUS = "Spontaneous";
var CASTER_PREPARATION_PREPARED = "Prepared";

function Character(name) {
  this.name = name;
  this.skillsTrainedOnly = ["Disable Device",
                            "Handle Animal",
                            "Knowledge (Arcana)",
                            "Knowledge (Dungeoneering)",
                            "Knowledge (Engineering)",
                            "Knowledge (Geography)",
                            "Knowledge (History)",
                            "Knowledge (Local)",
                            "Knowledge (Nature)",
                            "Knowledge (Nobility)",
                            "Knowledge (Planes)",
                            "Knowledge (Religion)",
                            "Linguistics",
                            "Profession",
                            "Sleight of Hand",
                            "Spellcraft",
                            "Use Magic Device"]

}
Character.prototype.getTrainedSkills = function() {
  var filteredSkills = [],
      skill,
      skills;

  skills = this.skills;
  for (skillName in skills) {
    skill = skills[skillName];
    if (skill.rank) {
      filteredSkills.push(skill);
    }
  }

  return filteredSkills;
};
Character.prototype.getUntrainedSkills = function() {
  var filteredSkills = [],
      skill,
      skills;

  skills = this.skills;
  for (skillName in skills) {
    skill = skills[skillName];
    if (!skill.rank && this.skillsTrainedOnly.indexOf(skill.name) === -1) {
      filteredSkills.push(skill);
    }
  }

  return filteredSkills;
};
Character.prototype.getUnusableSkills = function() {
  var filteredSkills = [],
      skill,
      skills;

  skills = this.skills;
  for (skillName in skills) {
    skill = skills[skillName];
    if (!skill.rank && this.skillsTrainedOnly.indexOf(skill.name) !== -1) {
      filteredSkills.push(skill);
    }
  }

  return filteredSkills;
};

/**
 There is no good name for this.
 It is just a base value, and a bunch of adjustments.
 Score is used for anything numeric; e.g. stats, skills, initiative, saving throws, hp, etc.
 The adjustments determine the final value.
 The acutal sheet value is available in 'sheetValue', and the calculated value is available in 'value'.
 */
function Score(name, base, sheetValue) {
  this.name = name;
  this.base = base || 0;
  this.adjustments = [];
  this.sheetValue = sheetValue || 0;
  this.showAsModifier = true;

  if (isNaN(sheetValue)) {
    this.sheetValue = Number.NaN;
  }

  Object.defineProperty(this, 'value', {
    get: function() {
      return this.adjustments.reduce(function (p, c) {
        if (c.isConditional) {
          return p;
        }
        return p + parseInt(c.value, 10);
      }, parseInt(this.base, 10));
    }
  });
}
Score.prototype.getAbilityScoreModifier = function () {
  return Math.floor((this.value - 10) / 2);
}
Score.prototype.getConditionalAdjustments = function() {
  return this.adjustments.filter(function (a) {
    return a.isConditional;
  })
}
Score.prototype.getUnconditionalAdjustments = function() {
  return this.adjustments.filter(function (a) {
    return !a.isConditional;
  })
}
Score.prototype.toString = function() {
  var text,
      content,
      unconditionalAdjustments,
      conditionalAdjustments,
      s = [];

  text = this.value;
  if (this.showAsModifier) {
    text = toModifier(text);
  }
  if (this.base) {
    s.push(this.base + " " + this.name);
  }
  unconditionalAdjustments = this.getUnconditionalAdjustments().join(", ");
  if (unconditionalAdjustments) {
    s.push(unconditionalAdjustments);
  }

  s = [s.join(", ")];

  conditionalAdjustments = this.getConditionalAdjustments().join(" ");
  if (conditionalAdjustments) {
    text += " " + conditionalAdjustments;
    s.push(conditionalAdjustments);
  }

  text = ooc(text, s.join(" "));
  if (!isNaN(this.sheetValue) && this.value != this.sheetValue) {
    text += " [[B][COLOR='RED']!WARNING![/COLOR][/B] Sheet value " + this.sheetValue +
      " does not match calculated value " + this.value + "=" + s.join(" ") + "]";
  }

  return text;
};
Score.prototype.addAdjustment = function(a) {
  this.adjustments.push(a);
}

/**
 If you pass a Score in as the only paramater value, then this will be used to setup the adjustment.
 */
function Adjustment(value, reason, isConditional) {
  if (arguments.length === 1) {
    this.value = value.getAbilityScoreModifier();
    this.reason = value.name + " Mod";
    this.isConditional = false;
  }
  else {
    this.value = value || 0;
    this.reason = reason || "";
    this.isConditional = isConditional || false;
  }
}
Adjustment.prototype.toString = function() {
  var s = [];
  if (this.isConditional) {
    s.push("(");
  }
  s.push(toModifier(this.value));
  s.push(" ");
  s.push(this.reason);
  if (this.isConditional) {
    s.push(")");
  }

  return s.join("");
};

/**
 Adjustments based on size. This defaults to the values in
 http://www.d20pfsrd.com/gamemastering/combat#Table-Size-Modifiers

 Use the multiplier to adjust the values, e.g. for SpecialSizeModifer multiplier = -1.
 */
function SizeModifier(size, multiplier) {

  var lookup = {
    "Fine": +8,
    "Diminutive": +4,
    "Tiny": +2,
    "Small": +1,
    "Medium": 0,
    "Large": -1,
    "Huge": -2,
    "Gargantuan": -4,
    "Colossal": -8
  };

  multiplier = multiplier || 1;
  Adjustment.call(this, lookup[size] * multiplier, "Size (" + size + ")", false);
}
SizeModifier.prototype = Object.create(Adjustment.prototype);
SizeModifier.prototype.constructor = SizeModifier;


/**
 Adjustments based on size for flyk from
 http://www.d20pfsrd.com/skills/fly
 */
function FlySizeModifier(size) {

  var lookup = {
    "Fine": +8,
    "Diminutive": +6,
    "Tiny": +4,
    "Small": +2,
    "Medium": 0,
    "Large": -2,
    "Huge": -4,
    "Gargantuan": -6,
    "Colossal": -8
  };

  Adjustment.call(this, lookup[size], "Size (" + size + ")", false);
}
FlySizeModifier.prototype = Object.create(Adjustment.prototype);
FlySizeModifier.prototype.constructor = FlySizeModifier;

/**
 Adjustments based on size for stealth from
 http://www.d20pfsrd.com/skills/stealth
 */
function StealthSizeModifier(size) {

  var lookup = {
    "Fine": +16,
    "Diminutive": +12,
    "Tiny": +8,
    "Small": +4,
    "Medium": 0,
    "Large": -4,
    "Huge": -8,
    "Gargantuan": -12,
    "Colossal": -16
  };

  Adjustment.call(this, lookup[size], "Size (" + size + ")", false);
}
StealthSizeModifier.prototype = Object.create(Adjustment.prototype);
StealthSizeModifier.prototype.constructor = StealthSizeModifier;


function parseCharacter(json) {
  function adjustments(character) {
    var abilityName,
        allAdjustments,
        adjustment,
        parts,
        value,
        reason,
        to,
        isConditional;

    allAdjustments = character.feats.filter(function (f) {
      return startsWith(f, "+") || startsWith(f, "-");
    });

    for (var i=0; i < allAdjustments.length; i++) {
      parts = allAdjustments[i].split(":");

      abilityName = parts[0].slice(1);
      if (character.abilities[abilityName]) {
        value = character.abilities[abilityName].getAbilityScoreModifier();
      }
      else {
        value = parseInt(parts[0], 10);
      }
      to = parts[1];
      reason = parts[2];
      isConditional = parts[3];
      adjustment = new Adjustment(value, reason, isConditional);

      if ("AC" === to) {
        character.ac.addAdjustment(adjustment);
        if (! startsWith(reason, "Dodge")) {
          character.acFlatFooted.addAdjustment(adjustment);
        }
        if (! startsWith(reason, "Natural")) {
          character.acTouch.addAdjustment(adjustment);
        }
      }
      else if ("Concentration" === to) {
        character.concentration.addAdjustment(adjustment);
      }
      else if ("CMB" === to) {
        character.cmb.addAdjustment(adjustment);
      }
      else if ("CMD" === to) {
        character.cmd.addAdjustment(adjustment);
      }
      else if ("Fortitude" === to || "Fort" === to) {
        character.savingThrows.fort.addAdjustment(adjustment);
      }
      else if ("Initiative" === to || "Init" === to) {
        character.initiative.addAdjustment(adjustment);
      }
      else if ("Reflex" === to || "Ref" === to) {
        character.savingThrows.ref.addAdjustment(adjustment);
      }
      else if ("Will" === to) {
        character.savingThrows.will.addAdjustment(adjustment);
      }
      else {
        for (var skill in character.skills) {
          if (startsWith(skill, to)) {
            character.skills[skill].addAdjustment(adjustment);
          }
        }
      }
    }
  }

  function addAbilities(character, sheetdata) {
    character.abilities = {};
    character.abilities.Str = new Score("Str", sheetdata.getStrength());
    character.abilities.Dex = new Score("Dex", sheetdata.getDexterity());
    character.abilities.Con = new Score("Con", sheetdata.getConstitution());
    character.abilities.Int = new Score("Int", sheetdata.getIntelligence());
    character.abilities.Wis = new Score("Wis", sheetdata.getWisdom());
    character.abilities.Cha = new Score("Cha", sheetdata.getCharisma());
  }

  function addArmorClass(character, sheetdata) {
    // http://paizo.com/pathfinderRPG/prd/combat.html
    // 10 + armor bonus + shield bonus + Dexterity modifier + other modifiers
    var adjustment,
        maxDex,
        ac = new Score("AC", 10, sheetdata.getAc()),
        acTouch = new Score("Touch", 10, sheetdata.getAcTouch()),
        acFlatFooted = new Score("Flat-footed", 10, sheetdata.getAcFlatFooted()),
        protections,
        protection;

    ac.showAsModifier = false;
    acTouch.showAsModifier = false;
    acFlatFooted.showAsModifier = false;

    // for each worn protective gear add adjustment
    protections = character.protections;
    if (protections.length === 0) {
      maxDex = Infinity;
    }
    else {
      maxDex = Number.NaN;
      for (var i=0; i < protections.length; i++) {
        protection = protections[i];
        if (protection.worn) {
          adjustment = new Adjustment(protection.bonus, protection.name);
          ac.addAdjustment(adjustment);
          acFlatFooted.addAdjustment(adjustment);
          if (protection.maxDex) {
            if (isNaN(maxDex)) {
              maxDex = protection.maxDex;
            }
            else {
              maxDex = Math.max(maxDex, protection.maxDex);
            }
          }
        }
      }
    }

    if (character.abilities.Dex.getAbilityScoreModifier() > maxDex) {
      adjustment = new Adjustment(maxDex, "Dex (capped)");
    }
    else {
      adjustment = new Adjustment(character.abilities.Dex.getAbilityScoreModifier(), "Dex");
    }
    ac.addAdjustment(adjustment);
    acTouch.addAdjustment(adjustment);

    if ("Medium" !== character.size) {
      adjustment = new SizeModifier(character.size);
      ac.addAdjustment(adjustment);
      acTouch.addAdjustment(adjustment);
      acFlatFooted.addAdjustment(adjustment);
    }

    // other modifiers handled in adjustments() section as they are manually added to the sheet

    character.ac = ac;
    character.acTouch = acTouch;
    character.acFlatFooted = acFlatFooted;
  }

  function addCombat(character, sheetdata) {
    character.bab = sheetdata.getBab();

    character.cmb = new Score("CMB", 0, sheetdata.getCmb());
    character.cmb.addAdjustment(new Adjustment(character.bab, "BAB"));
    if ("Fine" === character.size ||
        "Diminutive" === character.size ||
        "Tiny" === character.size) {
      character.cmb.addAdjustment(new Adjustment(character.abilities.Dex));
    }
    else {
      character.cmb.addAdjustment(new Adjustment(character.abilities.Str));
    }
    character.cmb.addAdjustment(new SizeModifier(character.size, -1));

    character.cmd = new Score("CMD", 10, sheetdata.getCmd());
    character.cmd.addAdjustment(new Adjustment(character.bab, "BAB"));
    character.cmd.addAdjustment(new Adjustment(character.abilities.Str));
    character.cmd.addAdjustment(new Adjustment(character.abilities.Dex));
    character.cmd.addAdjustment(new SizeModifier(character.size, -1));
  }

  /**
   Add all the equipment.

   If a location is specified then add the item to the "container" for that location.

   Weights are defined as a suffix to the name of the item in the format {<quantity@><weight>lb}, where quantity is optional.
   If not specified, then the weight field will be whatever was in the sheetdata.
   */
  function addEquipment(character, sheetdata) {
    var sheetdataEquipment,
        container,
        containers = {},
        item,
        equipment;

    function calculateWeight(item) {
      var startIndex,
          endIndex,
          weightCommand,
          parts;

      startIndex = item.name.indexOf("{");
      endIndex = item.name.indexOf("}");
      if (startIndex === -1 || endIndex === -1) {
        return item.weight;
      }

      weightCommand = item.name.slice(startIndex+1, endIndex);
      parts = weightCommand.split("@");
      if (parts.length === 1) {
        return parseFloat(parts[0]);
      }

      return parseInt(parts[0], 10) * parseFloat(parts[1]);
    }

    sheetdataEquipment = sheetdata.getEquipment();

    equipment = [];

    for (var i=0; i < sheetdataEquipment.length; i++) {
      item = sheetdataEquipment[i];
      item.weight = calculateWeight(item);
      equipment.push(item);

      if (item.location) {
        if (!containers[item.location]) {
          containers[item.location] = [];
        }
        containers[item.location].push(item);
      }
    }

    for (var containerKey in containers) {
      container = containers[containerKey];
      container.weight = container.reduce(function(p, c) {
        var itemWeight = parseFloat(c.weight)
        return p + itemWeight;
      }, 0.0);
    }

    character.containers = containers;
    character.equipment = equipment;
  }

  function addSavingThrows(character, sheetdata) {
    character.savingThrows = {};
    character.savingThrows.fort = new Score("Fort", sheetdata.getFort(), sheetdata.getFortTotal());
    character.savingThrows.fort.addAdjustment(new Adjustment(character.abilities.Con));

    character.savingThrows.ref = new Score("Ref", sheetdata.getRef(), sheetdata.getRefTotal());
    character.savingThrows.ref.addAdjustment(new Adjustment(character.abilities.Dex));

    character.savingThrows.will = new Score("Will", sheetdata.getWill(), sheetdata.getWillTotal());
    character.savingThrows.will.addAdjustment(new Adjustment(character.abilities.Wis));
  }

  function addSkills(character, sheetdata) {
    var sheetSkills = sheetdata.getSkills(),
        sheetSkill,
        skill,
        armorCheckPenalty = 0,
        trainedSkillAdjustments,
        trainedSkillAdjustment,
        index,
        parts;

    // adjust for trained skills
    trainedSkillAdjustments = sheetdata.getFeats().filter(function(f) {
      return startsWith(f, "{Trained Skills");
    });
    if (trainedSkillAdjustments.length === 1) {
      parts = trainedSkillAdjustments[0].slice(1,-1).split(":").slice(1);
      for (var i=0; i < parts.length; i++) {
        trainedSkillAdjustment = parts[i].slice(1);
        index = character.skillsTrainedOnly.indexOf(trainedSkillAdjustment);
        if (parts[i][0] === "+") {
          // Only add skills that are not already in the list
          if (index !== -1) {
            character.skillsTrainedOnly.push(trainedSkillAdjustment);
          }
        }
        else if (parts[i][0] === "-") {
          // Only delete skills that are already in the list
          if (index !== -1) {
            character.skillsTrainedOnly.splice(index, 1);
          }
        }
        else {
          Logger.log("Trained Skills adjustments must start with + or -: " + parts[i]);
        }
      }
    }


    for (var i=0; i < character.protections.length; i++) {
      if (character.protections[i].checkPenalty) {
        armorCheckPenalty += parseInt(character.protections[i].checkPenalty, 10);
      }
    }

    character.skills = {};

    for (var i=0; i < sheetSkills.length; i++) {
      sheetSkill = sheetSkills[i];
      if (!sheetSkill.ability) {
        // Anything without an ability defined is probably a header or a comment for the Player.
        continue;
      }
      skill = new Score(sheetSkill.name, 0, sheetSkill.modifier);
      skill.rank = sheetSkill.rank;

      if (sheetSkill.rank) {
        skill.addAdjustment(new Adjustment(skill.rank, "Rank"));
        if (sheetSkill.isClassSkill) {
          skill.addAdjustment(new Adjustment(3, "Class Skill"));
        }
      }
      skill.addAdjustment(new Adjustment(character.abilities[sheetSkill.ability]));
      if (armorCheckPenalty && ("Str" === sheetSkill.ability || "Dex" === sheetSkill.ability)) {
        skill.addAdjustment(new Adjustment(armorCheckPenalty, "ACP"));
      }

      character.skills[skill.name] = skill;
    }

    // Adjust for Size
    character.skills["Fly"].addAdjustment(new FlySizeModifier(character.size));
    character.skills["Stealth"].addAdjustment(new StealthSizeModifier(character.size));
  }

  /*
   Expect data on the sheet in the form of <SpellName>:<Note>:<ClassName>
   Where Note and ClassName are optional.
   Also note that this field is not contained within {}s (these are handled in spellBlockHandler)

   The spell will be looked up in the spellsdb by SpellName only.
   If it can't be found then it will be placed into the Unknown class

   NOTE: Some spellcasting will have empty levels, e.g. Alchemists do not know cantrips.

   character.spells = {
   "Unknown" = [], // Everything is at Level 0 since we dont know about them from the data provided
   "Wizard" = [ // Level 0 at index 0, etc.
   [ {name: "name", cast=numberCast, prepared=numberPrepared, note: "optional note"}, ...], // Level 0. Array also has properties to represent spell level meta-data
   // .dc=Save DC, .perDay = Score() + Adjustments, .known=nunmberOfSpellsKnown
   [], // Level 1
   ], // Array also has properties to represent global spell meta-data
   // .type="Prepared" || "Spontaneous" ( Prepared uses numberCast/numberPrepared on sheet, Spontaneous uses numberCast on sheet )
   "Priest" = [],
   "<ClassName>" = [],
   }

   */
  function addSpells(character, sheetdata) {
    var sheetSpells = sheetdata.getSpells(),
        sheetSpell,
        sheetSpellMetdata,
        spells,
        spell,
        defaultClassName,
        className,
        parts,
        spellsdb,
        spellInDb,
        levelIndex;

    spellsdb = SPELLS_DB_SHEET.sheet.getDataRange().getValues();
    spellsdb.name = SPELLS_DB_SHEET.name;

    spells = character.spells;
    defaultClassName = Object.keys(character.spells)[0];
    for (var i=0; i < sheetSpells.length; i++) {
      sheetSpell = sheetSpells[i];

      if (startsWith(sheetSpell.name, "{")) {
        // {}s are handled in spellBlockHandler
        continue;
      }

      spell = {};

      parts = sheetSpell.name.split(":");
      spell.name = parts[0];
      spell.note = parts[1];
      className = parts[2] || defaultClassName;
      spell.level = 0;

      spellInDb = find(spellsdb, [ { column: SPELLS_DB_SHEET.column.name-1, value: spell.name } ]);
      if (spellInDb) {
        levelIndex = SPELLS_DB_SHEET.column[className]-1;
        if (levelIndex) {
          spell.level = spellInDb[levelIndex];
        }
        spell.school = spellInDb[SPELLS_DB_SHEET.column.school-1];
        spell.subschool = spellInDb[SPELLS_DB_SHEET.column.subschool-1];
        spell.descriptor = spellInDb[SPELLS_DB_SHEET.column.descriptor-1];
      }
      else {
        className = "Unknown";
      }
      spell.cast = sheetSpell.cast;
      spell.memorized = sheetSpell.memorized;

      if (parseInt(spell.level,10) === undefined ) {
        // Ignore anything that is not a number
        continue;
      }
      if (spell.name === undefined || spell.name === null || spell.name === "") {
        // Ignore empty spells
        continue;
      }

      if (!spells[className]) {
        // This shouldn't be needed, except for typos in spell className, or {className:Type:...} commands.
        spells[className] = [];
      }

      if (!spells[className][spell.level]) {
        spells[className][spell.level] = [];
      }
      spells[className][spell.level].push(spell);
    }


    // If there is more than one class of spells, then the myth-weaver sheet doesn't have space for including the metadata. So it must be specified as an adjustment
    // (TODO: handle the adjustment https://github.com/baerrach/myth-weaver-utils-google-sheets/issues/1)
    // Otherwise a single class of spells will use the sheetdata spell metadata.
    if (1 === Object.keys(character.spells).length) {
      sheetSpellMetdata = sheetdata.getSpellMetadata();
      spells = character.spells[Object.keys(character.spells)[0]];
      spells.forEach(function (spellsForLevel, level) {
        spellsForLevel.known = sheetSpellMetdata[level].known;
        spellsForLevel.perDay = sheetSpellMetdata[level].perDay;
        spellsForLevel.bonus = sheetSpellMetdata[level].bonus;
        spellsForLevel.dc = sheetSpellMetdata[level].dc;
      });
    }
  }

  /**
   Handle {}s in the spells section.

   Currently known handlers are for:
   - <className>:Type:<Arcane || Divine>:<Prepared || Spontaneous>
   */
  function spellBlockHandler(character, sheetdata) {
    var sheetSpells = sheetdata.getSpells(),
        sheetSpell,
        className,
        classSpells,
        parts,
        hasSpells = false;

    character.spells = {};
    for (var i=0; i < sheetSpells.length; i++) {
      sheetSpell = sheetSpells[i];
      if (sheetSpell) {
        hasSpells = true;
      }

      parts = [];
      if (startsWith(sheetSpell.name, "{")) {
        parts = sheetSpell.name.slice(1,-1).split(":");
      }

      // ===========================================================
      // Handle spell block adjustments

      // Handle "<className>:Type:<Arcane || Divine>:<Prepared || Spontaneous>"
      if ("Type" === parts[1]) {
        className = parts[0];
        if (!character.spells[className]) {
          character.spells[className] = [];
        }

        character.spells[className].type = parts[2];
        character.spells[className].preparation = parts[3];
        continue;
      }
      // ===========================================================
    }

    if (hasSpells && 0 === Object.keys(character.spells).length) {
      // If no {className:Type:...} defined then default to "Unknown".
      character.spells["Unknown"] = [];
    }
  }

  var mythWeaverObject = JSON.parse(json);
  //  var mythWeaverObject = testData_Karolina;
  //  var mythWeaverObject = testData_Arabella;

  var character,
      sheetdata;

  sheetdata = SheetFactory(mythWeaverObject.sheet_template_id, mythWeaverObject.sheetdata);
  if (!sheetdata) {
    return;
  }

  character = new Character(sheetdata.getName());
  character.id = mythWeaverObject.id;
  character.updated_at = mythWeaverObject.updated_at;
  character.additionalInformation = sheetdata.getAdditionalInformation();
  character.alignment = sheetdata.getAlignment();
  character.class = sheetdata.getClass();
  character.hp = sheetdata.getHp();
  character.maxHp = sheetdata.getMaxHp();
  character.movement = {};
  character.movement.move = sheetdata.getMovement();
  character.movement.fly = sheetdata.getMovementFly();
  character.movement.swim = sheetdata.getMovementSwim();
  character.movement.burrow = sheetdata.getMovementBurrow();
  character.protections = sheetdata.getProtections();
  character.race = sheetdata.getRace();
  character.size = capitalizeFirstLetter(sheetdata.getSize());
  character.weapons = sheetdata.getWeapons();

  addAbilities(character, sheetdata);
  addSavingThrows(character, sheetdata);
  addCombat(character, sheetdata);

  addArmorClass(character, sheetdata);

  character.initiative = new Score("Initiative", 0, sheetdata.getInitiative());
  character.initiative.addAdjustment(new Adjustment(character.abilities.Dex));

  character.feats = sheetdata.getFeats();

  addSkills(character, sheetdata);

  spellBlockHandler(character, sheetdata);
  addSpells(character, sheetdata);

  character.languages = sheetdata.getLanguages();

  character.concentration = new Score("Concentration", 0, Number.NaN);

  addEquipment(character, sheetdata);

  adjustments(character);

  return character;
}

function toModifier(n) {
  n = parseInt(n, 10);
  if (n === undefined || n === null) {
    return "+0"
  }
  if (n >= 0) {
    return "+" + n;
  }
  else {
    return n.toString();
  }
}
