var sqlite3 = require('sqlite3');
var crypto = require('crypto');
const req = require('express/lib/request');
require('dotenv').config()
const axios = require('axios');
let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {});
var config = require('../config');

const { exec} = require('child_process');
const { env } = require('process');

function execute_command(command){
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
       
    });
}



function change_user_password_db(username, password, callback) {
    var hash = crypto.createHash('sha512');
    password = hash.update(password, 'utf-8');
    password = password.digest('hex');
    db.run("UPDATE users SET  password = (?) WHERE username = (?)", [password, username], function (err) {
        if (err) {
            console.log(err)
        } else {
            callback(true)
        }
    });


}

function login_db(username, password, callback) {
    var hash = crypto.createHash('sha512');
    password = hash.update(password, 'utf-8');
    password = password.digest('hex');
    db.all("SELECT * FROM users WHERE username = (?) AND password = (?)", [username, password], (err, rows) => {
        if (rows.length > 0) {
            callback(true)
        } else {
            callback(false)
        }
    });
}

function get_total_session_by_username(username, callback) {
    db.all("SELECT COUNT(session_number) FROM sessions WHERE username = (?)", [username], (err, rows) => {
        if (rows.length > 0) {
            let return_rows = Object.values(rows[0])[0]
            callback(return_rows)
        } else {
            callback(false)
        }
    });


}
function get_total_sessions() {
    return new Promise(resolve => {

    db.all("SELECT id FROM connections ", (err, rows) => {
        let found_sessions = []
        // console.log(rows)
        if (rows.length > 0) {
            // let return_rows = Object.values(rows[0])[0]
            for(i=0;i<rows.length;i++) {
                
                if(!found_sessions.includes(rows[i].id)){
                    found_sessions.push(rows[i].id)
                }

            }
            resolve(found_sessions)
        } else {
            resolve(0)
        }
    });
})

}


function get_all_commands_db(callback) {
    db.all("SELECT * FROM commands", (err, rows) => {
        callback(rows)
    });
}

async function add_ip_to_connections(id,ip,country){
    if(country == null) 
    country = "other"
    return new Promise(resolve => {
    db.run("INSERT INTO connections (id,ip,country) VALUES (?,?,?)", [id, ip,country], function (err) {
        if (err) {
            console.log(err)
           resolve(false)
        } else {
            
             resolve(true)
        }
    });
})
}
async function ip_info(ip){
    return new Promise(resolve => {
        axios.get("http://ip-api.com/json/"+ip).then(result=>{
            resolve(result.data.country);
        })
        
    })
}
async function clean_connections(){
    return new Promise(resolve => {
        db.run("DELETE FROM connections",function (err) {
            if (err) {
                console.log(err)
               resolve(false)
            } else {
                
                 resolve(true)
            }
            
    })
        
    })
}
async function all_country_connections(){
    return new Promise(resolve => {
        db.all("SELECT country FROM connections", (err, rows) => {
            var counts = {};

            
            rows.forEach(function(x) { counts[x.country] = (counts[x.country] || 0)+1; });
            resolve(counts)
        });
        
    })
}

async function ip_flag(ip){
    return new Promise(resolve => {
        try{
    axios.get("https://ipapi.com/ip_api.php?ip="+ip).then(res=>{
        
        resolve(res.data.location.country_flag)
    }).catch(err=>{})
}catch(e){}
})
}
function delete_ip_from_connections(id){
    return new Promise(resolve => {
    db.run("DELETE FROM connections WHERE id = (?)", [id], function (err) {
        if (err) {
            console.log(err)
            resolve(false)
        } else {
        resolve(true)
        }
    });
    })
}

function get_command_by_title(title, callback) {
    db.all("SELECT * FROM commands ", (err, rows) => {
        let return_rows = []
        for (i = 0; i < rows.length; i++) {
            if (rows[i].title.includes(title))
                return_rows.push({
                    title: rows[i].title,
                    des: rows[i].des,
                    command: rows[i].command
                })
        }
        callback(return_rows)
    });
}

function all_data(callback){
    db.all("SELECT username,role FROM users", (err, rows) => {
        
        callback(rows)
    });
}

function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function add_command(title, des, command, callback) {
    db.run("INSERT INTO commands (title,des,command) VALUES (?,?,?)", [title, des, command], function (err) {
        if (err) {
            callback(false)
        } else {
            callback(true)
        }
    });
}



function get_sessions_by_username(username, callback) {
    db.all("SELECT * FROM sessions WHERE username = (?)", [username], (err, rows) => {
        let rows_return = []
        for (i = 0; i < rows.length; i++) {
            rows_return.push(rows[i].session_number)
        }
        callback(rows_return)

    });
}



async function get_users_by_sesison_number(session){
    return new Promise(resolve => {
        let response = ""
        db.all("SELECT username FROM sessions WHERE session_number=(?)",[session], (err, rows) => {
            if(rows.length  == 0)
            resolve("there are no users")
            for(i=0;i<rows.length;i++){
                response = response + rows[i].username+","
            }
            response = response.slice(0, -1)
            resolve(response)
        })
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
function ipdata_check_ip(ip){
    return new Promise((resolve) => {
        try{
            if(!config.settings.block_proxy && !config.settings.block_anonymous && !config.settings.block_tor){
                resolve(false)
            }
    axios.get(`https://api.ipdata.co/${ip}?api-key=${process.env.ipdata_APIKEY}`).then(res=>{
    if(config.settings.block_tor){
        if(res.data.threat.is_tor){
            resolve(true)
        }
    }
    if(config.settings.block_anonymous){
        if(res.data.threat.is_anonymous){
            resolve(true)
        }
    }
    if(config.settings.block_proxy){
        if(res.data.threat.is_proxy){
            resolve(true)
        }
    }
    resolve(false)
    

    }).catch(err=>{resolve(false)})
}catch(e){resolve(false)}
});
}


module.exports = {
    execute_command,
    login_db,
    isValidHttpUrl,
    get_all_commands_db,
    get_command_by_title,
    add_command,
    get_sessions_by_username,
    change_user_password_db,
    get_total_session_by_username,
    all_data,
    add_ip_to_connections,
    delete_ip_from_connections,
    ip_info,
    clean_connections,
    all_country_connections,
    ip_flag,
    get_total_sessions,
    get_users_by_sesison_number,
    sleep,
    ipdata_check_ip
}