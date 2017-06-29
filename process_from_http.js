var http = require('http');
var url = require('url');
var request = require("request");
var fs = require('fs');
var exec = require('child_process').exec;
var fun = require('./parse_imagenet');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var txt = q.id1 + " " + q.id2;

  var s = "https://YaleSolrAdmin:rdxct7Wp3NJd5~V@search-index-dev.its.yale.edu/solr/ycba_collections_search/select?q="+q.id1+"%0A&fl=recordID_ss&wt=json&indent=true";

  request(s, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    var j = JSON.parse(body).response.docs[0].recordID_ss[0];
    console.log('json:',j);
    var s2 = "http://deliver.odai.yale.edu/info/repository/YCBA/object/"+j+"/type/2";
    request(s2, function (error2, response2, body2) {
      console.log('error2:', error2); // Print the error if one occurred
      console.log('statusCode2:', response2 && response2.statusCode); // Print the response status code if a response was received
      //console.log('body2:', body2); // Print the HTML for the Google homepage.
      var j2a = JSON.parse(body2)[0].derivatives[3].bucketName;
      var j2b = JSON.parse(body2)[0].derivatives[3].bucketPath;
      var j3b = JSON.parse(body2)[0].derivatives[3].filename;
      var image_url = "http://" + j2a + "/" + j2b;
      console.log('json2a:',j2a);
      console.log('json2b:',j2b);
      console.log('image_url:',image_url);

      var dir = './cache';
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      if (!fs.existsSync("cache/"+j3b)) {
        var file = fs.createWriteStream("cache/"+j3b);
        var request = http.get(image_url, function(response) {
          response.pipe(file);
        });
      }

      py_bin = "/Users/erjhome/github_clones/models/tutorials/image/imagenet/classify_image.py"
      command = "python " + py_bin + " --image_file cache/"+j3b;
      var child = exec(command, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        var out = fun.parse_imagenet(stdout);
        console.log('jsonscore: ',out);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
        res.end(out);
      });
    });
  });
  //res.end("txt");
}).listen(8080);
