var SHEET_API_URL_STUB = "http://www.myth-weavers.com/api/v1/sheets/sheets/";
var SHEET_URL_STUB = "http://www.myth-weavers.com/sheet.html#id=";

/**
 Fetch the myth-weavers sheet for the specified URL.
 The returned JSON will be pruned so that it has been re-rooted at sheetdata,
 deleted fields of root: data, sheet_template, revisions
 deleted fields of root.sheetdata: __txt_*
 */
function getCharacterJSON(id) {
  var url = SHEET_API_URL_STUB + id;
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();

  var data = JSON.parse(json);
  var obj = data.sheetdata;
  delete obj.sheet_template;
  delete obj.sheet_data;
  obj.sheetdata = obj.data; // rename for changes made to myth-weaver sheets around 2016-05-19

  // Pathfinder Experimental txt blocks
  delete obj.sheetdata["__txt_statblock"];
  delete obj.sheetdata["__txt_statsummary"];
  //  delete obj.sheetdata["__txt_other_notes"]; // DON'T DELETE - Other Notes (equivalent to Additional Information)
  delete obj.sheetdata["__txt_character_1"];
  delete obj.sheetdata["__txt_character_2"];
  delete obj.sheetdata["__txt_character_3"];
  delete obj.sheetdata["__txt_character_4"];
  delete obj.sheetdata["__txt_character_5"];
  delete obj.sheetdata["__txt_character_6"];

  // Pathfinder txt blocks.
  delete obj.sheetdata["__txt_Notes"];
  delete obj.sheetdata["__txt_char_traits"];
  delete obj.sheetdata["__txt_char_contacts"];
  delete obj.sheetdata["__txt_char_description"];
  delete obj.sheetdata["__txt_char_enemies"];
  delete obj.sheetdata["__txt_char_flaws"];
  delete obj.sheetdata["__txt_char_personality"];
  delete obj.sheetdata["__txt_private_notes"];
  delete obj.sheetdata["__txt_text1"]; // Conditions and Effects (No equivalent for Pathfiner Experimental Sheet)
  //  delete obj.sheetdata["__txt_text2"]; // DON'T DELETE - Additional Information

  return JSON.stringify(obj);
}
