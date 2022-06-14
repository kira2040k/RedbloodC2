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

    router.use(session({
        secret: process.env.session,
        saveUninitialized: false,
        resave: false
    }));
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    //get commands
    router.get('/', function (req, res) {
        if(!req.session.username) return;
        if (req.query.title == "") {
            funs.get_all_commands_db(data => {
                res.send(data)
            })
        } else {
            funs.get_command_by_title(req.query.title, (data) => {
                res.send(data)
            })
        }
    })
    router.get('/all_ip_connections', async function (req, res) {
        if(!req.session.username) return;

        const response = await funs.all_country_connections()
        res.json(response)
    })
    router.get('/add_auto_command', function (req, res) {
        if(!req.session.username) return;

        funs.add_command(req.query.title, req.query.des, req.query.command, (data) => {
            if (data) {
                res.send("done")

            } else {
                res.send("Error")
            }
        })

    })

   
    
   
    router.get('/all_data', function (req, res) {
        if(!req.session.username) return;

        funs.all_data(data => {
            res.send(data)
        })

    })
    router.get('/ip_by_id/:id', async function (req, res) {
        if(!req.session.username) return;
        let response = await funs.ip_by_id(req.params.id)
        res.send(response)
    })  
    // country_by_id
    router.get('/country_by_id/:id', async function (req, res) {
        if(!req.session.username) return;
        let response = await funs.country_by_id(req.params.id)
        res.send(response)
    }) 
    
    
    router.get('/get_users_by_session_id/:id',async function (req, res) {
        if(!req.session.username) return;
        // let sessions =  await funs.get_total_sessions()
        let users = await funs.get_users_by_sesison_number(parseInt(req.params.id))
        res.send(`${users}`)

    })
    router.get('/total_sessions',async function (req, res) {
        if(!req.session.username) return;
        let sessions =  await funs.get_total_sessions()
        res.send(`[${sessions}]`)

    })
    router.get('/total_sessions_list_numbers',async function (req, res) {
        if(!req.session.username) return;
        let sessions =  await funs.get_total_sessions()
        res.send(`[${sessions}]`)

    })
    router.get('/all_sessions', function (req, res) {
        if(!req.session.username) return;

        res.send("done")

    })

    
    return router;
};