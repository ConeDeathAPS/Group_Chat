var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var session = require("express-session");

app.use(session({secret: "weifbsdliasdfrgj"}));

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + "/static"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	console.log("Client requested " + req.url);
	res.render("index");
})

var server = app.listen(6789, function() {
	console.log("Listening on 6789");
})

var io = require("socket.io").listen(server);

var users = {};
var counter = 0;

io.sockets.on("connection", function(socket) {
	console.log("New connection on " + socket.id);
	socket.on("new_user", function(name) {
		counter++;
		//store their name and id into an object
		var user_data = {name: name.name, id: socket.id};
		//put this info into an object containing all current users
		users[counter] = (user_data);
		console.log(users);
		socket.emit("new_user_info", {user_data});
		//broadcast a welcome message to all other users
		socket.broadcast.emit("new_user_entered", {message: "<p>" + name.name + " has joined the chat.</p>"});	
	});
	socket.on("new_message", function(data) {
		console.log("data: ", data);
		var message = "<p><span class='names'>" + data.name + ": </span>" + data.content;
		console.log(message);
		io.emit("send_message", {message});
	})

})