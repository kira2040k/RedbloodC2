function send_auto_command(text,number){
    websocket = new WebSocket("ws://localhost/server/"+number, "ws");
    websocket.onopen = () => websocket.send("Message");
    websocket.onopen =  () =>  websocket.send(JSON.stringify({
        message:"command",command:text+"\n"
    }));

}

function get_number_of_shell(){
    try{
    let number = document.getElementsByClassName("ng-scope active")[0].innerText
    number = number.substring(number.indexOf('#') + 1);
    return number
}
    catch(e){}

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
function disconnect_shell(){
    const number = get_number_of_shell()
    if(number == undefined) {
        alert("please select session")
        return;
    }
    const isExecuted = confirm("Are you sure to kill this session?");
    if(!isExecuted) return;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        }


      };
      xhttp.open("GET", "/apis/kill_session?session="+number, true);
      xhttp.send();
    //   websocket = new WebSocket("ws://localhost/servers", "ws");
      websocket = new WebSocket("ws://localhost/server/"+number, "ws");

    websocket.onopen = () => websocket.send("Message");
    websocket.onopen =  () =>  websocket.send(JSON.stringify({
        message: "data",
        data: "connection closed"
    }));
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
        try{
            let c2 = /(kiraC2_.*_kiraC2)/.exec(response)[0]
            if(c2){
                    c2 = c2.replace("kiraC2_","").replace("_kiraC2","")
                    c2 = prompt(c2, "");
                    response = response.replace(/(kiraC2_.*_kiraC2)/,c2)
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

function clear_notes(){
    var tableHeaderRowCount = 1;
var table = document.getElementById('notes_table');
var rowCount = table.rows.length;
for (var i = tableHeaderRowCount; i < rowCount; i++) {
    table.deleteRow(tableHeaderRowCount);
}
}
function add_note(){
    const number = get_number_of_shell()
    const note = prompt("Your note:")
    const isExecuted = confirm("Are you sure to add this note?");
    if(!isExecuted) return;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      }
    };
    xhttp.open("POST", "/apis/add_note", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("session_id="+number+"&note="+note);

}

function open_notes(){
    const number = get_number_of_shell()
    if(number == undefined) {
        alert("please select session")
        return;
    }
    clear_notes();
    list_notes();
    let form = document.getElementById('notes_div');
    if(form.style.display == "block") 
    {
        form.style.display = "none";
        
    }
    else {form.style.display = 'block'}

}

function open_obfuscate_path(){
    let form = document.getElementById('obfuscate_path_div');
    if(form.style.display == "block") 
    {
        form.style.display = "none";
        
    }
    else {form.style.display = 'block'}

}

function delete_note(id){
    const isExecuted = confirm("Are you sure to delete this note?");
    if(!isExecuted) return;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        }


      };
      xhttp.open("GET", "/apis/delete_note?id="+id, true);
      xhttp.send();
}

function get_notes_by_session_id(id){
    return new Promise(resolve => {

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        
        try{
            if(this.responseText != "false"){
                resolve(JSON.parse(this.responseText));            

            }else{
                resolve(false)
            }
        }catch(e){}
        
    }


      };
      xhttp.open("GET", `/apis/get_notes_by_id?session_id=${id}`, true);
      xhttp.send();
    })
}

async function list_notes() {
    var table = document.getElementById("notes_table");
    table.className = "table_color"
    const number = await get_number_of_shell()
    console.log(number)
    const response = await get_notes_by_session_id(number)
    console.log(response)
    for(i=0;i<response.length;i++){
        console.log(response)
        var row = table.insertRow(i+1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = response[i].username;
        cell2.innerHTML = response[i].note;
        cell3.innerHTML = `<button onclick='delete_note(${response[i].id})' 
        style='background: rgba(215, 0, 0, 0.654);color: white;font-size: 17px;border: 1px solid grey;
        'type='submit'>delete
        </button>`;
    

    }

}


function delete_offline_shell(id){
    const isExecuted = confirm("Are you sure to delete this offlin session?");
    if(!isExecuted) return;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

        }


      };
      xhttp.open("GET", "/apis/disapper_offline_shell?id="+id, true);
      xhttp.send();
}

function is_zero(){
    const number = 4
    let num = Math.floor(Math.random() * number)
    if(num == 0){
        return true
    }else{
        return false
    }
}

function insert_backtrick(string){
    if(is_zero()){
        return string+"`"
    }else{
        return string
    }
}


function changecase(string,after_slash){
    if(is_zero()) return string
    if(string == string.toLowerCase() ){
        if(after_slash){
            return insert_backtrick(string.toUpperCase())

        }
        return string.toUpperCase()

    }else{
        if(after_slash){
            return insert_backtrick(string.toLowerCase())

        }
        return string.toLowerCase()

    }
}
function run_obfuscate_path(file,total){
    let count = 0
    let checker
    let return_string = ""
    let after_slash = false    
    for(i=0;i<file.length;i++){
        checker = is_zero()
        if(checker && count < total && file[i] != "$" && file[i] != ":" && file[i] !="\\" && file[i] !="."){
            return_string += "?"
            count++;
        }else{
            return_string +=changecase(file[i],after_slash)
            // return_string +=file[i]

        }
        if(file[i] == "\\"){
            after_slash = true
        }
        
    }
    if(return_string.toLowerCase().includes("$e") && return_string.toLowerCase().includes("?")){
        if(return_string.substr(-1) == "`"){
            return return_string.slice(0, -1);
        }
        return return_string

    }else{
        try{
        return run_obfuscate_path(file,total)
        }catch(e){ return "error"}
    }
}

function click_obfuscate_path(){
    const file = document.getElementById("obfuscate_path_id").value
    const obfuscated_path = run_obfuscate_path(file,13)
    document.getElementById("obfuscate_path_id").value = obfuscated_path
}