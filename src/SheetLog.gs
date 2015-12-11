var LOG_SHEET = {
  name: "Log",
  firstDataRow: 1,
  get sheet () {
    return getSheet(this.name);
  }
}
