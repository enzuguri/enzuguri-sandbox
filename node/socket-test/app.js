var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8090);

function handler (req, res) {
	
	if(req.url == "/command"){
		
		console.log("gone to command");
		
		sendCommandToSpotify("play");
		
	}
	
	
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

var webSocket = null;

io.sockets.on('connection', function (socket) {
	
	socket.on("play-clicked", function(data){
		sendCommandToSpotify("play");
	});
	
	socket.on("join", function(data){
		
		if(data.client == "web" && !webSocket){
			webSocket = socket;
			console.log("added web client");
		}
		
	});
	

});

var sendCommandToSpotify = function(cmd){
	webSocket.emit("spotify-command", {command:cmd});
}


