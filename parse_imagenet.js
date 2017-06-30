var request = require("request");

exports.parse_imagenet = function (stdout) {
  stdout_lines = stdout.split("\n");

  var o = [];
  for (var i = 0, len = stdout_lines.length; i < len - 1; i++) {
    var stdout_line = stdout_lines[i].split("(");
    var line = {
      category: stdout_line[0].trim(),
      score: stdout_line[1].trim().slice(0, -1).split(" ")[2]
    };
    o.push(line);
  }

  console.log('test:',get_getty("vestment"));
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
  //var q_enc = q;
  console.log("QENC:"+q_enc);
  var u = "http://vocab.getty.edu/sparql.json?query="+q_enc+"&_implicit=false&implicit=true&_equivalent=false&_form=%2Fsparql";
  //var u = "http://vocab.getty.edu/sparql";
  //var u = "http://www.google.com";
  //console.log("URLENC:"+u);
  //request(u, function (error, response, body) {
  //  console.log('error:', error); // Print the error if one occurred
  //  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //  console.log('body:', body); // Print the HTML for the Google homepage.
  //  var j = JSON.parse(body);
  //  return j;
  //});

  var options = {
    url: u,
    headers: {
      'User-Agent': 'request',
      'accept': 'application/sparql-results+json'
    }
  };

  var ex;
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body).results.bindings[0].s.value;
      //console.log("TRY:",info);
      //console.log("BB:",body);
      console.log("IN:",info);
      ex = info;
    }
  }

  request(options,callback);
  console.log("ENDP:",ex);

  return u;
};
