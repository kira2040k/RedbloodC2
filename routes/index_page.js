module.exports = function(app) {
    const path = require('path')
	var router = require('express').Router();
    var session = require('express-session')
    require('dotenv').config()
    router.use(session({
        secret: process.env.session,
        saveUninitialized: false,
        resave: false
    }));
    const config = require('../config')
    const funs = require('./funs');
router.get('/',funs.check_login_user, async function (req, res) {
    const notes = [[{username:"kira",note:"kira note",id:1},{username:"bassam",note:"bassam note",id:2}]]
    res.render(path.join(__dirname, "../pages/index.ejs"), {settings:config.settings,notes:notes})
    // res.sendFile('index.html', { root: path.join(__dirname, '../pages/') });      
    

})
   
	return router;
};
