module.exports = function (app) {
    var router = require('express').Router();
    const fs = require('fs');
    const funs = require('./funs');
    const Server_funs = require('../server.js');
    var session = require('express-session')
    const path = require('path')
    const bodyParser = require('body-parser');
    require('dotenv').config()
    const { exec} = require('child_process');
    const randomstring = require("randomstring");

    
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    //get commands
    router.get('/', funs.check_login_user,async function (req, res) {
        if (req.query.title == "") {
            const data = await funs.get_all_commands_db()
        res.send(data)
        } else {
            funs.get_command_by_title(req.query.title, (data) => {
                res.send(data)
            })
        }
    })
    router.get('/all_ip_connections',funs.check_login_user, async function (req, res) {

        const response = await funs.all_country_connections()
        res.json(response)
    })
    router.get('/add_auto_command',funs.check_login_user, function (req, res) {

        funs.add_command(req.query.title, req.query.des, req.query.command, (data) => {
            if (data) {
                res.send("done")

            } else {
                res.send("Error")
            }
        })

    })

   
    
   
    router.get('/all_data',funs.check_login_user, function (req, res) {

        funs.all_data(data => {
            res.send(data)
        })

    })
    router.get('/ip_by_id/:id',funs.check_login_user, async function (req, res) {
        let response = await funs.ip_by_id(req.params.id)
        res.send(response)
    })  
    // country_by_id
    router.get('/country_by_id/:id',funs.check_login_user, async function (req, res) {
        let response = await funs.country_by_id(req.params.id)
        res.send(response)
    }) 
    
    
    router.get('/get_users_by_session_id/:id',funs.check_login_user,async function (req, res) {
        let users = await funs.get_users_by_sesison_number(parseInt(req.params.id))
        res.send(`${users}`)

    })
    router.get('/total_sessions',funs.check_login_user,async function (req, res) {
        let sessions =  await funs.get_total_sessions()
        res.send(`[${sessions}]`)

    })
    router.get('/total_sessions_list_numbers',funs.check_login_user,async function (req, res) {
        let sessions =  await funs.get_total_sessions()
        res.send(`[${sessions}]`)

    })
    router.get('/delete_auto_command',funs.check_login_user, function (req, res) {
        funs.delete_auto_command(req.query.title)
        res.send("done")

    })
    router.post('/add_on_connection_command',funs.check_login_user, function (req, res) {
        funs.add_on_connection_command(req.body.title,req.body.des,req.body.command)
        res.send("done")

    })
    router.post('/delete_on_connection_command',funs.check_login_user, function (req, res) {
        funs.delete_on_connection_command(req.body.id)
        res.send("done")

    })
    router.get('/delete_note',funs.check_login_user, function (req, res) {
        funs.delete_note(req.query.id)
        res.send("done")

    })
    router.post('/add_note',funs.check_login_user,async function (req, res) {
        const token = req.cookies.session
        const username = await funs.get_user_from_token(token)
        const session = parseInt(req.body.session_id.replace(/\%20/ig,"").replace(/\%C2/ig,"").replace(/\%A0/ig,""))

        funs.add_note(username,req.body.note,session)
        res.send("done")
    })
    router.get('/change_role',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
        const token = req.cookies.session
        const username = await funs.get_user_from_token(token)
        const is_admin = await funs.is_admin(username)
        let role = "user"
        if(req.query.role == "admin"){
            role = 'admin'
        }
        if(is_admin){
            funs.change_user_role(req.query.username,role)
            res.send("done")
            return
        }
        res.send("Only admin")
    })
    router.get('/change_username',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
        
            console.log(req.query.username)
            console.log(req.query.new_username)
            funs.change_username(req.query.username,req.query.new_username)
            res.send("done")
    })
    router.get('/delete_user',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
       
            funs.delete_user(req.query.username,req.query.id)
            res.send("done")
            return
    })
    router.get('/add_session',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
        funs.add_session(req.query.username,req.query.id)
        res.send("done")
        return
})
router.get('/delete_session',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
    funs.delete_session(req.query.username,req.query.id)
    res.send("done")
    return
})
    router.post('/add_user',[funs.check_login_user,funs.check_admin],async function (req, res) {
        
        
            let result = await funs.add_user(req.body.username,req.body.password)
            if(result == "user already exists"){
                res.send(result)
                return
            }
    })
    router.get('/get_notes_by_id',async function (req, res) {
        const session = parseInt(req.query.session_id)
        const data = await funs.get_notes_by_id(session)

         res.send(data)

    })

    
    return router;
};