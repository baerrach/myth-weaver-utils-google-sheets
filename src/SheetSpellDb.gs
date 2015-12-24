var SPELLS_DB_SHEET = {
  name: "spellsdb",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    name: 1,
    school: 2,
    subschool: 3,
    descriptor: 4,
    spell_level: 5,
    casting_time: 6,
    components: 7,
    costly_components: 8,
    range: 9,
    area: 10,
    effect: 11,
    targets: 12,
    duration: 13,
    dismissible: 14,
    shapeable: 15,
    saving_throw: 16,
    spell_resistence: 17,
    description: 18,
    description_formated: 19,
    source: 20,
    full_text: 21,
    verbal: 22,
    somatic: 23,
    material: 24,
    focus: 25,
    divine_focus: 26,
    Sorcerer: 27,
    Wizard: 28,
    Cleric: 29,
    Druid: 30,
    Ranger: 31,
    Bard: 32,
    Paladin: 33,
    Alchemist: 34,
    Summoner: 35,
    Witch: 36,
    Inquisitor: 37,
    Oracle: 38,
    Antipaladin: 39,
    Magus: 40,
    Adept: 41,
    deity: 42,
    SLA_Level: 43,
    domain: 44,
    short_description: 45,
    acid: 46,
    air: 47,
    chaotic: 48,
    cold: 49,
    curse: 50,
    darkness: 60,
    death: 61,
    disease: 62,
    earth: 63,
    electricity: 64,
    emotion: 65,
    evil: 66,
    fear: 67,
    fire: 68,
    force: 69,
    good: 70,
    language_dependent: 71,
    lawful: 72,
    light: 73,
    mind_affecting: 74,
    pain: 75,
    poison: 76,
    shadow: 77,
    sonic: 78,
    water: 79,
    linktext: 80,
    id: 81,
    material_costs: 82,
    bloodline: 83,
    patron: 84,
    mythic_text: 85,
    augmented: 86,
    mythic: 87,
    Bloodrager: 88,
    Shaman: 89,
    Psychic: 90,
    Medium: 91,
    Mesmerist: 92,
    Occultist: 93,
    Spiritualist: 94,
    Skald: 95,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
