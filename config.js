const settings = {
	block_tor:false,
	block_proxy:false,
	block_anonymous:false,
	port:80,
	token_expire:'1800s', // 30M
	offline_shells:true,
	listeners_ports:[443,1337],
	colors:{
		shell_list_backgound_color:"black",
		index_background:"#333333",
		terminal_color:"white",
		terminal_background_color:"black",
	}

};


module.exports = {settings};