var request = require("request");
var srequest = require('sync-request');

exports.parse_imagenet = function (stdout) {
  stdout_lines = stdout.split("\n");

  var o = [];
  for (var i = 0, len = stdout_lines.length; i < len - 1; i++) {
    var stdout_line = stdout_lines[i].split("(");
    var cat_arr = stdout_line[0].split(",");
    var getties = [];
    for (var i2 = 0, len2 = cat_arr.length; i2 < len - 1;i2++) {
      if (cat_arr[i2] === undefined) {
        continue;
      }
      console.log("category1:",cat_arr[i2].trim());
      getty1 = get_getty(cat_arr[i2].trim());
      if (getty1 != "") {
        getties.push(getty1);
      }
    }
    var line = {
      category: stdout_line[0].trim(),
      endpoints: getties,
      score: stdout_line[1].trim().slice(0, -1).split(" ")[2]
    };
    o.push(line);
  }

  //console.log('test:',get_getty("vestmentt"));
  return JSON.stringify(o);
};

function get_getty (keyword) {
  var q = "SELECT ?s ?name {" +
    "?s a skos:Concept; luc:term \""+keyword+"\";" +
    "skos:inScheme <http://vocab.getty.edu/aat/> ;" +
    "gvp:prefLabelGVP [skosxl:literalForm ?name]." +
    "FILTER regex(?name, \""+keyword+"\", \"i\") ." +
    "} ORDER BY ?name";

  var q_enc = encodeURIComponent(q);
  console.log("QENC:"+q_enc);
  var u = "http://vocab.getty.edu/sparql.json?query="+q_enc+"&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql";
  console.log("URLENC:"+u);

  var options = {
    headers: {
      'User-Agent': 'request',
      'accept': 'application/sparql-results+json'
    }
  };

  var gettyID = "";
  var res = srequest('GET', u, options);
  console.log("rawBODY:",JSON.parse(res.getBody()));
  if (JSON.parse(res.getBody()).results.bindings.length == 0) {
    console.log("No gettyID found for:", keyword);
    return "";
  } else {
    gettyID = JSON.parse(res.getBody()).results.bindings[0].s.value;
    console.log("gettyID:",gettyID);
    return gettyID;
  }
};
