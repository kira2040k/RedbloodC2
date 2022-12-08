import std/[times, os]
import std/httpclient
import osproc
# import std/cpuinfo
import std/strutils

proc sleep1(): void = 
  let time = cpuTime()
  sleep(1000) 

  if(cpuTime() - time<1):
     quit()
  discard
# sleep()

proc cores(): void =
  if countProcessors() < 4:
    quit()

proc send_request(): void= 
  var client = newHttpClient()
  var c = client.getContent("http://google.com")
# send_request()

# sleep(20000)
# sleep1()
# cores()
# send_request()
# var  aaa = "aaa"
# echo " aaa" 

var powershell1234 = "pЁoЁwЁeЁrЁsЁhЁeЁlЁlЁ".replace("Ё","")
echo powershell1234
# let errC = execCmd("$# $# $# -c calc.exe" % ["powershell","-nologo","-noprofile"])
