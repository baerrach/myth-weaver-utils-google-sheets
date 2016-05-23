/**
 * Tests that two statblocks are equal.
 *
 * @param {string} expected The expected text.
 * @param {string} actual The actual test.
 * @return whether the actual test was equal to the expected test.
 * @customfunction
 */
function testStatblock(expected, actual) {
  // statblocks contain '(generated by ...)' text at the end of the first line.
  // As this contains text that varies based on date it needs to be excluded from the comparison.
  var replacements,
      expectedAsLines,
      actualAsLines,
      actualLine, expectedLine,
      failures = [],
      expectedLength, actualLength,
      expectedLineLength, actualLineLength,
      line, charIndex;

  replacements = [
    { match: /(\d\d\d\d-\d\d-\d\d)/, replace: "YYYY-MM-DD" }
  ];
  for (var i = 0; i < replacements.length; i++) {
    expected = expected.replace(replacements[i].match, replacements[i].replace);
    actual = actual.replace(replacements[i].match, replacements[i].replace);
  }

  expectedAsLines = expected.split("\n");
  actualAsLines = actual.split("\n");
  expectedLength = expectedAsLines.length;
  actualLength = actualAsLines.length;

  lineChecking:
  for (line = 0; line < expectedLength; line++) {
    if (line > actualLength) {
      failures.push("[" + line + "] missing.");
      continue;
    }

    actualLine = actualAsLines[line];
    expectedLine = expectedAsLines[line];

    actualLineLength = actualLine.length;
    expectedLineLength = expectedLine.length;

    for (charIndex = 0; charIndex < expectedLineLength; charIndex++) {
      if (expectedLine[charIndex] !== actualLine[charIndex]) {
        failures.push("[" + line + ":" + charIndex + "] "+ context(charIndex, expectedLine, actualLine));
        continue lineChecking;
      }
    }
  };
  if (actualLength > expectedLength) {
    failures.push("[" + expectedLength + "] too many lines");
  }

  return failures.length === 0 ? "PASSED" : failures.join("\n");
}

function context(charIndex, expected, actual) {
  var expectedContext, actualContext;

  expectedContext = expected.slice(Math.max(0, charIndex - 5), Math.min(charIndex + 5, expected.length));
  actualContext = actual.slice(Math.max(0, charIndex - 5), Math.min(charIndex + 5, actual.length));

  return "'" + expectedContext + "' != '" + actualContext + "'";
}
