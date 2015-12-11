function ooc(text, content) {
  var tmp = [];
  tmp.push("[OOC=");
  tmp.push(text);
  tmp.push("]");
  tmp.push(content);
  tmp.push("[/OOC]");
  return tmp.join("");
}

function oocWithSelection(text, selection, content) {
  if (selection) {
    text = text + ": " + selection;
  }
  if (selection) {
    content += "\n\n[B]Selected[/B]: " + selection;
  }      
  return ooc(text, content);
}
