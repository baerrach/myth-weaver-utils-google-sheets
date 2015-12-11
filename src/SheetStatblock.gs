var STATBLOCK_SHEET = {
  name: "Statblock",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  get sheet () {
    return getSheet(this.name);
  }
}
