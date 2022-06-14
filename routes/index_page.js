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
router.get('/', function (req, res) {
    let sess = req.session
    if(sess.username){
    res.sendFile('index.html', { root: path.join(__dirname, '../pages/') });      
    }else{
        res.redirect("/login")
    }
    

})
   
	return router;
};
