module.exports = function (app) {
	const funs = require("./funs")
	var router = require('express').Router();
	var session = require('express-session')
	var sockets = [];
	app.set("sockets", sockets);

	var socketsByServer = {};
	app.set("socketsByServer", socketsByServer);

	app.ws('/servers',async function (ws, req) {
		//[+]check session here please [+]
		let check = await funs.check_login_user_socket(req)
		if(!check) return;
		app.get("servers").forEach(async function (server) {
			
			const username = await funs.get_user_from_token(req.cookies.session)
			const data = await funs.get_all_by_username(username)
			let sessions = await funs.get_sessions_by_username(username)			
			if(data[0].role == "admin"){
				sessions = "all"
			}
			try{
			if(sessions == "all" || sessions.includes(parseInt(server.id))){
				ws.send(JSON.stringify({
					message: "newServer",
					id: server.id,
					ip: server.ip,
					dead: server.dead,
					flag: await funs.ip_flag(server.ip),
					appear:server.appear,
					type:server.type,
					os:server.os
				}));
	
			}
		}catch(e){console.log(e)}
		});

		sockets.push(ws);
		app.set("sockets", sockets);
	});

	app.ws('/server/:id',async function (ws, req) {
		//[+]check session here please [+]
		let check = await funs.check_login_user_socket(req)
		if(!check) return;
		
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
			let id;
			try {
				for(i=0;i<servers.length;i++) {
					if(servers[i].id == req.params.id){
						id = i
					}
				}
				message.command = await funs.run_command(message.command)
				
				servers[id].socket.write(message.command); // Write command
			} catch (e) {console.log(e)}

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