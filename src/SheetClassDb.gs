var CLASS_DB_SHEET = {
  name: "classdb",
  headerRow: 1,
  get firstDataRow () {
    return this.headerRow + 1;
  },
  column: {
    url: 1,
    class: 2,
    feature: 3,
    description: 4,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
