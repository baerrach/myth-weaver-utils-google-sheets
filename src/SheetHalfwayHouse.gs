var HALFWAY_HOUSE_SHEET = {
  name: "Halfway House",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    name: 1,
    textForSheet: 2,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
