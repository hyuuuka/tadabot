const keep_alive = () => {

var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);

export { keep_alive };
