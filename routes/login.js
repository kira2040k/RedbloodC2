module.exports = function (app) {
    const path = require('path')
    var router = require('express').Router();
    const funs = require('./funs');
    require('dotenv').config()
    

    router.get('/', function (req, res) {
        res.sendFile('login.html', {
            root: path.join(__dirname, '../pages/')
        });
    
    })
    router.post('/', async function (req, res) {
        //check if username or password is blank
        if(!req.body.username || !req.body.password);
        const login_data = await funs.login_db(req.body.username, req.body.password)
            if (login_data) {
                const token = funs.generateAccessToken({ username: req.body.username });
                res.send(token);
                // let username = req.body.username
                // sess.username = username;
                // res.redirect("/")
            } else {
                res.send('wrong password');
            }
        })


    return router;
};