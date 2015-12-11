var ENCUMBRANCE_SHEET = {
  name: "Encumbrance",
  headerRow: 2,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    name: 1,
    weight: 2,
    location: 3,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
