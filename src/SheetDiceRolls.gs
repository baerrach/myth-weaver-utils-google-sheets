var DICE_ROLLS_SHEET = {
  name: "Dice Rolls",
  firstDataRow: 1,
  column: {
    diceRolls: 1,
  },
  get sheet () {
    return getSheet(this.name);
  }
}
