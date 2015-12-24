var MAX_EQUIPMENT = 43;
var MAX_FEATS = 72;
var MAX_LANGUAGES = 10;
var MAX_PROTECTIONS = 4;
var MAX_SKILLS = 46;
var MAX_SPELL_LEVELS = 9;
var MAX_SPELLS = 120;
var MAX_WEAPONS = 6;

function SheetFactory(sheet_template_id, sheetdata) {
  if (10 === sheet_template_id) {
    return new PathfinderExperimentalSheet(sheetdata);
  }
  if (39 === sheet_template_id) {
    return new PathfinderSheet(sheetdata);
  }
  Logger.log("Unknown Sheet Template Id = " + sheet_template_id);
  return null;
}

// ===========================================================================================
// Base class Sheet
// ===========================================================================================

function Sheet(s) {
  this.sheetdata = s;
  this.keyFor = {}
}
Sheet.prototype.getAc = function () {
  return this.sheetdata[this.keyFor.ac];
}
Sheet.prototype.getAcFlatFooted = function () {
  return this.sheetdata[this.keyFor.acFlatFooted];
}
Sheet.prototype.getAcTouch = function () {
  return this.sheetdata[this.keyFor.acTouch];
}
Sheet.prototype.getAdditionalInformation = function () {
  return this.sheetdata[this.keyFor.additionalInformation];
}
Sheet.prototype.getAlignment = function () {
  return this.sheetdata[this.keyFor.alignment];
}
Sheet.prototype.getBab = function () {
  return this.sheetdata[this.keyFor.bab];
}
Sheet.prototype.getClass = function () {
  return this.sheetdata[this.keyFor.class];
}
Sheet.prototype.getCmb = function () {
  return this.sheetdata[this.keyFor.cmb];
}
Sheet.prototype.getCmd = function () {
  return this.sheetdata[this.keyFor.cmd];
}
Sheet.prototype.getEquipment = function () {
  var item,
      equipment = [];

  for (var i=1; i <= MAX_EQUIPMENT; i++) {
    item = this.getItem(i);
    if (item === undefined || item === null) {
      continue;
    }
    equipment.push(item);
  }

  return equipment;
}
Sheet.prototype.getFeats = function () {
  var feat,
      feats = [];

  for (var i=1; i <= MAX_FEATS; i++) {
    feat = this.getFeat(i);
    if (feat === undefined || feat === null) {
      continue;
    }
    feats.push(feat);
  }
  return feats;
}
Sheet.prototype.getFort = function () {
  return this.sheetdata[this.keyFor.fort];
}
Sheet.prototype.getFortTotal = function () {
  return this.sheetdata[this.keyFor.fortTotal];
}
Sheet.prototype.getHp = function () {
  return this.sheetdata[this.keyFor.hp];
}
Sheet.prototype.getMaxHp = function () {
  return this.sheetdata[this.keyFor.maxHp];
}
Sheet.prototype.getInitiative = function () {
  return this.sheetdata[this.keyFor.initiative];
}
Sheet.prototype.getLanguages = function () {
  var language,
      languages = [];

  for (var i=1; i <= MAX_LANGUAGES; i++) {
    language = this.getLanguage(i);
    if (language === undefined || language === null || language === "") {
      continue;
    }
    languages.push(language);
  }
  return languages;
}
Sheet.prototype.getName = function () {
  return this.sheetdata[this.keyFor.name];
}
Sheet.prototype.getProtection = function () {
  return ["Must be defined in subclass"];
}
Sheet.prototype.getRace = function () {
  return this.sheetdata[this.keyFor.race];
}
Sheet.prototype.getRef = function () {
  return this.sheetdata[this.keyFor.ref];
}
Sheet.prototype.getRefTotal = function () {
  return this.sheetdata[this.keyFor.refTotal];
}
Sheet.prototype.getSkill = function (i) {
  var keys = this.getSkillKeys(i),
      skill;

  if (!this.sheetdata.hasOwnProperty(keys.name)) {
    return null;
  }

  skill = {};
  skill.name = this.sheetdata[keys.name];
  if ("" === skill.name) {
    return null;
  }

  skill.modifier = parseInt(this.sheetdata[keys.modifier], 10) || 0;
  skill.isClassSkill = Boolean(this.sheetdata[keys.isClassSkill]);
  skill.rank = parseInt(this.sheetdata[keys.rank], 10) || 0;
  skill.ability = this.sheetdata[keys.ability];
  skill.abilityModifier = parseInt(this.sheetdata[keys.abilityModifier], 10) || 0;

  return skill;
}
Sheet.prototype.getSkills = function () {
  var skill,
      skills = [];

  for (var i = 1; i <= MAX_SKILLS; i++) {
    skill = this.getSkill(i);
    if (skill === undefined || skill === null) {
      continue;
    }
    skills.push(skill);
  }
  return skills;
}
Sheet.prototype.getSpell = function (i) {
  var keys = this.getSpellKeys(i),
      parts,
      spell;

  if (!this.sheetdata.hasOwnProperty(keys.name)) {
    return null;
  }

  spell = {};
  spell.name = this.sheetdata[keys.name];
  if (this.sheetdata[keys.notes]) {
    parts = this.sheetdata[keys.notes].split("/");
    spell.cast = parts[0];
    spell.memorized = parts[1];
  }

  return spell;
}
Sheet.prototype.getSpells = function () {
  var spell,
      spells = [];

  for (var i=1; i <= MAX_SPELLS; i++) {
    spell = this.getSpell(i);
    if (spell === undefined || spell === null) {
      continue;
    }
    spells.push(spell);
  }

  return spells;
}
Sheet.prototype.getSpellMetadatum = function (i) {
  var keys = this.getSpellMetadatumKeys(i),
      datum = {};

  datum.known = this.sheetdata[keys.known];
  datum.bonus = this.sheetdata[keys.bonus];
  datum.perDay = this.sheetdata[keys.perDay];
  datum.dc = this.sheetdata[keys.dc];

  return datum;
}
Sheet.prototype.getSpellMetadata = function () {
  var spellMetadata = [],
      datum;

  for (var i=0; i <= MAX_SPELL_LEVELS; i++) {
    datum = this.getSpellMetadatum(i);
    if (datum === undefined || datum === null) {
      continue;
    }
    spellMetadata[i] = datum;
  }

  return spellMetadata;
}
Sheet.prototype.getMovement = function () {
  return this.sheetdata[this.keyFor.movementMove];
}
Sheet.prototype.getMovementBurrow = function () {
  return this.sheetdata[this.keyFor.movementBurrow];
}
Sheet.prototype.getMovementFly = function () {
  return this.sheetdata[this.keyFor.movementFly];
}
Sheet.prototype.getMovementSwim = function () {
  return this.sheetdata[this.keyFor.movementSwim];
}
Sheet.prototype.getWill = function () {
  return this.sheetdata[this.keyFor.will];
}
Sheet.prototype.getWillTotal = function () {
  return this.sheetdata[this.keyFor.willTotal];
}


// ===========================================================================================
// Pathfinder Sheet (Template Id 39)
// ===========================================================================================

function PathfinderSheet(sheetdata) {
  Sheet.call(this, sheetdata);
  this.keyFor.ac = "AC";
  this.keyFor.acFlatFooted = "ACFlat";
  this.keyFor.acTouch = "ACTouch";
  this.keyFor.additionalInformation = "__txt_text2";
  this.keyFor.alignment = "Alignment";
  this.keyFor.bab = "MABBase";
  this.keyFor.cmb = "CMB";
  this.keyFor.cmd = "CMD";
  this.keyFor.class = "Class";
  this.keyFor.fort = "FortBase";
  this.keyFor.fortTotal = "Fort";
  this.keyFor.hp = "HPWounds";
  this.keyFor.initiative = "Init";
  this.keyFor.maxHp = "HP";
  this.keyFor.movementMove = "Speed";
  this.keyFor.name = "Name";
  this.keyFor.race = "Race";
  this.keyFor.ref = "ReflexBase";
  this.keyFor.refTotal = "Reflex";
  this.keyFor.will = "WillBase";
  this.keyFor.willTotal = "Will";

}
PathfinderSheet.prototype = Object.create(Sheet.prototype);
PathfinderSheet.prototype.constructor = PathfinderSheet;
PathfinderSheet.prototype.getFeat = function (i) {
  // Feats are split across three keys Feat, Featxtra and then Featxtrax
  // After Feat1 -> Feat36 it becomes Featxtra0 -> Featxtra21
  // After Featxtra21 it becomes Featxtrax1 and then Featxtrax21 (I think these two are a bug)
  if (i === 36 + 22 + 1) {
    return this.sheetdata["Featxtrax1"];
  }
  if (i === 36 + 22 + 2) {
    return this.sheetdata["Featxtrax21"];
  }
  if (i > 36) {
    return this.sheetdata["Featxtra" + (i - 37)];
  }
  return this.sheetdata["Feat" + i];
}
PathfinderSheet.prototype.getItem = function (i) {
  var item,
      index = Utilities.formatString('%02d', i);

  if (this.sheetdata["Gear" + index]) {
    item = {};
    item.name = this.sheetdata["Gear" + index];
    item.weight = this.sheetdata["Gear" + index + "W"];
    item.location = this.sheetdata["Gear" + index + "01Loc"];
  }

  return item;
}

PathfinderSheet.prototype.getLanguage = function (i) {
  return this.sheetdata["Lang" + i];
}
PathfinderSheet.prototype.getProtections = function () {
  var protection,
      protections = [];

  if (this.sheetdata["ArmorName"]) {
    protection = {};
    protection.name = this.sheetdata["ArmorName"];
    protection.worn = this.sheetdata["ArmorWorn"];
    protection.bonus = this.sheetdata["ArmorBonus"];
    protection.checkPenalty = this.sheetdata["ArmorCheck"];
    protection.maxDex = this.sheetdata["ArmorDex"];
    protection.arcaneSpellFailure = this.sheetdata["ArmorSpell"];
    protections.push(protection);
  }
  if (this.sheetdata["ShieldName"]) {
    protection = {};
    protection.name = this.sheetdata["ShieldName"];
    protection.worn = this.sheetdata["ShieldWorn"];
    protection.bonus = this.sheetdata["ShieldBonus"];
    protection.checkPenalty = this.sheetdata["ShieldCheck"];
    protection.maxDex = this.sheetdata["ShieldDex"];
    protection.arcaneSpellFailure = this.sheetdata["ShieldSpell"];
    protections.push(protection);
  }

  return protections;
}
PathfinderSheet.prototype.getSkillKeys = function (i) {
  var keys = {},
      prefix = "Skill" + Utilities.formatString('%02d', i);

  keys.name = prefix;
  keys.modifier = prefix + "Mod";
  keys.isClassSkill = prefix + "CC";
  keys.rank = prefix + "Rank";
  keys.ability = prefix + "Ab";
  keys.abilityModifier = prefix + "AbMod";

  return keys;
}
PathfinderSheet.prototype.getSpellKeys = function (i) {
  var keys = {},
      prefix = "Spell" + Utilities.formatString('%02d', i);

  keys.name = prefix;
  keys.notes = prefix + "Cast";

  return keys;
}
PathfinderSheet.prototype.getSpellMetadatumKeys = function (i) {
  var keys = {};

  keys.known = "SpellsKnown" + i;
  keys.perDay = "SpellPerDay" + i;
  keys.bonus = "BonusSpells" + i;
  keys.dc = "SpellDC" + i;

  return keys;
}
PathfinderSheet.prototype.getWeapons = function () {
  var prefix,
      weapon,
      weapons = [];

  for (var i=1; i <= MAX_WEAPONS; i++) {
    prefix = "Weapon" + i;
    if (this.sheetdata[prefix]) {
      weapon = {};
      weapon.name = this.sheetdata[prefix];
      weapon.bonus = this.sheetdata[prefix + "AB"];
      weapon.damage = this.sheetdata[prefix + "Damage"];
      weapon.type = this.sheetdata[prefix + "Type"];
      weapon.crit = this.sheetdata[prefix + "Crit"];
      weapon.range = this.sheetdata[prefix + "Range"];
      weapon.special = this.sheetdata[prefix + "Special"];
      weapons.push(weapon);
    }
  }

  return weapons;
}
PathfinderSheet.prototype.getStrength = function(i) {
  return this.sheetdata["StrTemp"] || this.sheetdata["Str"];
}
PathfinderSheet.prototype.getDexterity = function(i) {
  return this.sheetdata["DexTemp"] || this.sheetdata["Dex"];
}
PathfinderSheet.prototype.getConstitution = function(i) {
  return this.sheetdata["ConTemp"] || this.sheetdata["Con"];
}
PathfinderSheet.prototype.getIntelligence = function(i) {
  return this.sheetdata["IntTemp"] || this.sheetdata["Int"];
}
PathfinderSheet.prototype.getWisdom = function(i) {
  return this.sheetdata["WisTemp"] || this.sheetdata["Wis"];
}
PathfinderSheet.prototype.getCharisma = function(i) {
  return this.sheetdata["ChaTemp"] || this.sheetdata["Cha"];
}

// ===========================================================================================
// Pathfinder Experimental Sheet (Template Id 10)
// ===========================================================================================


function PathfinderExperimentalSheet(sheetdata) {
  Sheet.call(this, sheetdata);
  this.keyFor.ac = "ac_total";
  this.keyFor.acFlatFooted = "ac_flat_footed";
  this.keyFor.acTouch = "ac_touch";
  this.keyFor.alignment = "alignment";
  this.keyFor.additionalInformation = "__txt_other_notes";
  this.keyFor.bab = "mab_base";
  this.keyFor.cmb = "cmb_ab";
  this.keyFor.cmd = "ac_cmd";
  this.keyFor.class = "class";
  this.keyFor.fort = "fortitude_base";
  this.keyFor.fortTotal = "fortitude_total";
  this.keyFor.hp = "hp";
  this.keyFor.initiative = "init_total";
  this.keyFor.maxHp = "max_hp";
  this.keyFor.movementBurrow = "movespeed_burrow";
  this.keyFor.movementFly = "movespeed_fly";
  this.keyFor.movementMove = "movespeed_move";
  this.keyFor.movementSwim = "movespeed_swim";
  this.keyFor.name = "name";
  this.keyFor.race = "race";
  this.keyFor.ref = "reflex_base";
  this.keyFor.refTotal = "reflex_total";
  this.keyFor.will = "will_base";
  this.keyFor.willTotal = "will_total";
}
PathfinderExperimentalSheet.prototype = Object.create(Sheet.prototype);
PathfinderExperimentalSheet.prototype.constructor = PathfinderExperimentalSheet;
PathfinderExperimentalSheet.prototype.getItem = function (i) {
  var item,
      prefix = "equip" + i + "_";

  if (this.sheetdata[prefix]) {
    item = {};
    item.name = this.sheetdata[prefix];
    item.weight = this.sheetdata[prefix + "weight"];
    item.location = this.sheetdata[prefix + "loc"];
  }
  return item;
}
PathfinderExperimentalSheet.prototype.getFeat = function (i) {
  return this.sheetdata["feat_" + i];
}
PathfinderExperimentalSheet.prototype.getLanguage = function (i) {
  return this.sheetdata["language_" + i];
}
PathfinderExperimentalSheet.prototype.getProtections = function () {
  var prefix,
      protection,
      protections = [];

  for (var i=0; i <= MAX_PROTECTIONS; i++) {
    prefix = "protect_" + i;
    if (this.sheetdata[prefix + "_name"]) {
      protection = {};
      protection.name = this.sheetdata[prefix +  "_name"];
      protection.worn = this.sheetdata[prefix +  "_worn"];
      protection.bonus = this.sheetdata[prefix +  "ac_bonus"];
      protection.checkPenalty = this.sheetdata[prefix +  "chk_pen"];
      protection.maxDex = this.sheetdata[prefix +  "max_dex"];
      protection.arcaneSpellFailure = this.sheetdata[prefix +  "spell_fail"];
      protection.maxSpeed = this.sheetdata[prefix +  "speed"];
      protections.push(protection);
    }
  }

  return protections;
}
PathfinderExperimentalSheet.prototype.getSkillKeys = function (i) {
  var keys = {},
      prefix = "skill_" + i;
  keys.name = prefix + "_name";
  keys.modifier = prefix + "_skill_mod";
  keys.isClassSkill  = prefix + "_prof";
  keys.rank = prefix + "_rank";
  keys.ability = prefix + "_abil";
  keys.abilityModifier = prefix + "_abil_mod";

  return keys;
}
PathfinderExperimentalSheet.prototype.getSpellKeys = function (i) {
  var keys = {},
      prefix = "spell_" + i;
  keys.name = prefix;
  keys.notes = prefix + "_mem";

  return keys;
}
PathfinderExperimentalSheet.prototype.getSpellMetadatumKeys = function (i) {
  var keys = {},
      prefix = "spell_lvl_" + i;

  keys.known = prefix + "_known";
  keys.perDay = prefix + "_spells_per_day";
  keys.bonus = prefix + "_bonus_spells";
  keys.dc = prefix + "_save_dc";

  return keys;
}
PathfinderExperimentalSheet.prototype.getWeapons = function () {
  var prefix,
      weapon,
      weapons = [];

  for (var i=1; i <= MAX_WEAPONS; i++) {
    prefix = "wpn" + i;
    if (this.sheetdata[prefix + "_name"]) {
      weapon = {};
      weapon.name = this.sheetdata[prefix + "_name"];
      weapon.bonus = this.sheetdata[prefix + "_ab"];
      weapon.damage = this.sheetdata[prefix + "_dmg"];
      weapon.type = this.sheetdata[prefix + "_type"];
      weapon.crit = this.sheetdata[prefix + "_crit"];
      weapon.range = this.sheetdata[prefix + "_range"];
      weapon.special = this.sheetdata[prefix + "_special"];
      weapons.push(weapon);
    }
  }

  return weapons;
}
PathfinderExperimentalSheet.prototype.getStrength = function(i) {
  return this.sheetdata["strength_temp_score"] || this.sheetdata["strength_score"];
}
PathfinderExperimentalSheet.prototype.getDexterity = function(i) {
  return this.sheetdata["dexterity_temp_score"] || this.sheetdata["dexterity_score"];
}
PathfinderExperimentalSheet.prototype.getConstitution = function(i) {
  return this.sheetdata["constitution_temp_score"] || this.sheetdata["constitution_score"];
}
PathfinderExperimentalSheet.prototype.getIntelligence = function(i) {
  return this.sheetdata["intelligence_temp_score"] || this.sheetdata["intelligence_score"];
}
PathfinderExperimentalSheet.prototype.getWisdom = function(i) {
  return this.sheetdata["wisdom_temp_score"] || this.sheetdata["wisdom_score"];
}
PathfinderExperimentalSheet.prototype.getCharisma = function(i) {
  return this.sheetdata["charisma_temp_score"] || this.sheetdata["charisma_score"];
}
