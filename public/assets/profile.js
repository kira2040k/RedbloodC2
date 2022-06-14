function open_change_password_form(){
    let form = document.getElementById('change_password_form');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}

function change_password_send(){
    let old_password = document.getElementById('old_password').value;
    let new_password = document.getElementById('new_password').value;
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/profile", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`new_password=${new_password}&old_password=${old_password}`);

    xhttp.onload = function() {
        if(this.responseText == "done"){
            document.getElementById("change_password_status").style.display = ""
            document.getElementById("change_password_message").innerHTML = "The password has been changed"
             
        }
    }
}

function open_auto_command(){
    let form = document.getElementById('auto_command_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}


function auto_command_send(){

    let title = document.getElementById('auto_command_title').value;
    let des = document.getElementById('auto_command_des').value;
    let command = document.getElementById('auto_command_command').value;
    
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `/apis/add_auto_command?title=${title}&des=${des}&command=${command}`, true);
    xhttp.send()
    xhttp.onload = function() {
        if(this.responseText == "done"){
            document.getElementById("auto_command_status").style.display = ""
            document.getElementById("auto_command_message").innerHTML = "The command was added."
             
        }
    }

}


