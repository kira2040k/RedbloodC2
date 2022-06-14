function send_auto_command(text,number){
    websocket = new WebSocket("ws://localhost/server/"+number, "ws");
    console.log(number)
    websocket.onopen = () => websocket.send("Message");
    websocket.onopen =  () =>  websocket.send(JSON.stringify({
        message:"command",command:text+"\n"
    }));

}

function get_number_of_shell(){
    
    let number = document.getElementsByClassName("ng-scope active")[0].innerText
    number = number.substring(number.indexOf('#') + 1);
    return number
    // send_auto_command("echo 134",number)

}

function get_command_from_title(title,callback){
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //   document.getElementById("demo").innerHTML = this.responseText;
        
        try{
            
            let command = JSON.parse(this.responseText)[0].command
            return callback(command)
        }catch(e){}
        
    }


      };
      xhttp.open("GET", "/apis?title="+title, true);
      xhttp.send();
}

function query_commands(){
    xhttp = new XMLHttpRequest();
    list = []
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //   document.getElementById("demo").innerHTML = this.responseText;
        for(i=0;i<1000;i++){
        try{
            list.push(JSON.parse(this.responseText)[i].title)
        }catch(e){}
        }
    }


      };
      xhttp.open("GET", "/apis?title=", true);
      xhttp.send();
      return list

}


function run_command(){
    
    let title = document.getElementById("command_search").value;
    get_command_from_title(title,(response)=>{
       try{
        let c1 = /(kiraC1_.*_kiraC1)/.exec(response)[0]
        if(c1){
                c1 = c1.replace("kiraC1_","").replace("_kiraC1","")
                c1 = prompt(c1, "");
                response = response.replace(/(kiraC1_.*_kiraC1)/,c1)
            }
        }catch(e){}
        send_auto_command(response,get_number_of_shell())
    })
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function loader_command(){ 
command_list = await document.getElementById("commands_datalist")
all_commands = await query_commands()
await sleep(4000)
for(i=0;i<all_commands.length;i++){
  var option = await document.createElement('option');
  option.value = await all_commands[i];
  await command_list.appendChild(option);
}
}
loader_command()



function command_description(){
    let command = document.getElementById("command_search").value
    if(command.length == 0){
    
        document.getElementById("command_des_div").style.display = "none"
    }
    else{
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        try{
            command = JSON.parse(this.responseText)[0].command
            let command_des = JSON.parse(this.responseText)[0].des
            document.getElementById("command_des_div").style = ""
            document.getElementById("command_des_message").innerHTML = command_des
            document.getElementById("command_to_copy").innerHTML = command

        }catch(e){}
        
    }


      };
      xhttp.open("GET", "/apis?title="+command, true);
      xhttp.send();
    }
}
setInterval(command_description, 1500);
function copy_command(){
    let command = document.getElementById("command_to_copy").innerHTML
    command  = command.replaceAll("&amp;","&")
    navigator.clipboard.writeText(command)
}