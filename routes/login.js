module.exports = function (app) {
    const path = require('path')
    var router = require('express').Router();
    const funs = require('./funs');
    var session = require('express-session')
    require('dotenv').config()
    router.use(session({
        secret: process.env.session,
        saveUninitialized: false,
        resave: false
    }));
    var sess

    router.get('/', function (req, res) {
        res.sendFile('login.html', {
            root: path.join(__dirname, '../pages/')
        });
    })
    router.post('/', function (req, res) {
        sess = req.session
        //check if username or password is blank
        if(!req.body.username || !req.body.password);
        funs.login_db(req.body.username, req.body.password, (data) => {
            if (data) {
                let username = req.body.username
                sess.username = username;
                res.redirect("/")
            } else {
                res.redirect('/login?status=wrong');
            }
        })
    })


    return router;
};