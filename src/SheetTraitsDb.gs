var TRAITS_DB_SHEET = {
  name: "traitsdb",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    url: 1,
    type: 3,
    category: 4,
    name: 5,
    description: 14,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
