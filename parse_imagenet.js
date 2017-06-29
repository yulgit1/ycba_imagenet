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

  //return stdout_lines[0];
  return JSON.stringify(o);
};
