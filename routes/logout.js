module.exports = function (app) {
    var router = require('express').Router();
    const path = require('path');
    const funs = require("./funs")
    //get commands
    router.get('/', function (req, res) {
        res.clearCookie("session");

        res.redirect("/login")
    })
   
   
    return router;
}