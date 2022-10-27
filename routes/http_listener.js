async function http_listener() {
	var lis = express();
	let list_cookies = []
    let id = 0
    let servers = []
	
	lis.use(bodyParser.urlencoded({
		extended: true
	}));
	lis.use(bodyParser.json());
	lis.use(cookieParser());
    
	lis.get("/", (req, res) => {
		if(!list_cookies.includes(req.cookies.id)){
			list_cookies.push(req.cookies.id);
			servers.push({
				socket: null,
				id: id,
				ip: req.socket.remoteAddress,
				dead: false,
				appear: true
			});
			sockets.filter(function (ws) {
				try {
					ws.send(JSON.stringify({
						message: "newServer",
						id: "1",
						ip: "!sad",
						dead: true,
						appear: true
					}));

					return true;
				} catch (e) {

					return false;
				}
			});
			id++
		}
		res.send("ls")
	})

	lis.post("/", (req, res) => {
		res.send("Hi")
	})

	lis.listen(8080, function () {

	});


}
// http_listener()
