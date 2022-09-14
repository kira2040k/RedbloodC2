// Express init
const https = require('https');
var express = require('express');
var xss = require("xss");
var session = require('express-session')
var app = express();
const ejs = require('ejs');
var expressWs = require('express-ws')(app);
const funs  = require('./routes/funs');
app.use(express.urlencoded({
	extended: true
}));
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const config = require('./config');
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

// Routing
app.use(express.static('public'));
app.use('/', require("./routes/index_page")(app))
app.use('/', require('./routes/index')(app));
app.use('/login', require('./routes/login')(app));
app.use('/apis', require('./routes/apis')(app));
app.use('/logout', require('./routes/logout')(app))
app.use('/profile', require('./routes/profile')(app));
//delete all dead connections
funs.clean_connections()

// Start
app.listen(config.settings.port, function () {
	console.log('PPS app listening on port ' + config.settings.port + '!');
});


var net = require('net');

var id = 0;

var servers = [];
app.set("servers", servers);

var messagesByServer = {};
app.set("messagesByServer", messagesByServer);

async function open_port(port) {
	var server = net.createServer(async function (socket) {
		var currentId = id + "";
		var currentIP = socket.address().address + "";
		if(await funs.ipdata_check_ip(currentIP))	{
			socket.destroy()
			return
		}

		
		await funs.add_ip_to_connections(currentId,currentIP,await funs.ip_info(currentIP))
		socket.on("data", function (data) {
			if (messagesByServer[currentId] == undefined) {
				messagesByServer[currentId] = [];
			}
			data = data.toString().replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "") // remove ANSI codes
			data = xss(data)
			data = Buffer.from(data, 'utf-8');
			// console.log(data.toString())
			messagesByServer[currentId].push(data);

			app.set("messagesByServer", messagesByServer);

			var socketsByServer = app.get("socketsByServer");

			if (socketsByServer[currentId] == undefined) {
				socketsByServer[currentId] = [];
			}

			socketsByServer[currentId].filter(async function (ws) {
				try {
					// console.log(data.toString()); ///--> response from  reverse shell
					

					data = data.toString().replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "") // remove ANSI codes
					data = xss(data)
					data = Buffer.from(data, 'utf-8'); // string to buffer
					ws.send(JSON.stringify({
						message: "data",
						data: data + ""
					}));

					return true;
				} catch (e) {
					return false;
				}
			});

			app.set("socketsByServer", socketsByServer);
		});
		// delete connection 
		socket.on("end", function () {
			funs.delete_ip_from_connections(currentId)
			if (messagesByServer[currentId] == undefined) {
				messagesByServer[currentId] = [];
			}

			messagesByServer[currentId].push("connection closed");

			app.set("messagesByServer", messagesByServer);

			var socketsByServer = app.get("socketsByServer");

			if (socketsByServer[currentId] == undefined) {
				socketsByServer[currentId] = [];

			}

			socketsByServer[currentId].filter(function (ws) {
				try {
					ws.send(JSON.stringify({
						message: "data",
						data: "connection closed"
					}));
					

					return true;
				} catch (e) {
					return false;
				}
			});

			app.set("socketsByServer", socketsByServer);

			var servers = app.get("servers");

			servers[currentId].dead = true;


			var sockets = app.get("sockets");

			sockets.filter(function (ws) {
				try {
					ws.send(JSON.stringify({
						message: "newServer",
						id: currentId,
						ip: currentIP,
						dead: true,
					}));

					return true;
				} catch (e) {

					return false;
				}
			});

			app.set("sockets", sockets);
		})
		socket.on("error", function (data) {
			if (messagesByServer[currentId] == undefined) {
				messagesByServer[currentId] = [];
			}

			messagesByServer[currentId].push("connection closed");

			app.set("messagesByServer", messagesByServer);

			var socketsByServer = app.get("socketsByServer");

			if (socketsByServer[currentId] == undefined) {
				socketsByServer[currentId] = [];

			}

			socketsByServer[currentId].filter(function (ws) {
				try {
					ws.send(JSON.stringify({
						message: "data",
						data: "connection closed"
					}));
					

					return true;
				} catch (e) {
					return false;
				}
			});

			app.set("socketsByServer", socketsByServer);

			var servers = app.get("servers");

			servers[currentId].dead = true;


			var sockets = app.get("sockets");

			sockets.filter(function (ws) {
				try {
					ws.send(JSON.stringify({
						message: "newServer",
						id: currentId,
						ip: currentIP,
						dead: true,
					}));

					return true;
				} catch (e) {

					return false;
				}
			});

			app.set("sockets", sockets);
		});
		servers.push({
			socket: socket,
			id: id,
			ip: socket.address().address,
			dead: false,
		});

		app.set("servers", servers);

		var sockets = app.get("sockets");

		sockets.filter(function (ws) {
			try {
				ws.send(JSON.stringify({
					message: "newServer",
					id: id,
					ip: socket.address().address,
					dead: false,
				}));
		return true
	} catch (e) {
				console.log(e)

				return false;
			}
		});
		app.set("sockets", sockets);
		id++;
		
	});
	server.listen(port, '0.0.0.0');

}
open_port(443)

//open port
app.get('/apis/open_port', function (req, res) {
	open_port(parseInt(req.query.port))
	res.send('done')
  })



