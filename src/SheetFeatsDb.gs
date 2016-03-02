var FEATS_DB_SHEET = {
  name: "featsdb",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    name: 2,
    type: 3,
    description: 4,
    benefit: 7,
    textForSheet: 31,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
