module.exports = function (app) {
    var router = require('express').Router();
    const path = require('path');
    const funs = require("./funs")
    //get commands
    router.get('/',async function (req, res) {
        if(!req.session.username){
            res.redirect('/login')
            return;
        };


            res.render(path.join(__dirname, "../pages/profile.ejs"), {
                username: req.session.username,
                total_session: "not in public verion"
            })


    })
    router.post('/', function (req, res) {
        if(!req.session.username) return;
        funs.login_db(req.session.username, req.body.old_password, login_data => {
            if (!login_data) { // if password is not correct
                res.send("current password incorrect")
                return;
            } else { // if password is correct chnage it.
                funs.change_user_password_db(req.session.username, req.body.new_password, data => {
                    res.send("done")

                })
            }
        })

    })
    return router;
}