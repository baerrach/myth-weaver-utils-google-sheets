var DOSSIERS_SHEET = {
  name: "Dossiers",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    skill: 1,
    max: 2,
    firstCharacter: 3,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
