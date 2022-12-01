
module.exports = function (app) {
const config = require('../config')
    var router = require('express').Router();
    const path = require('path');
    const funs = require("./funs")
    //get commands
    router.get('/',funs.check_login_user,async function (req, res) {
        const username = await funs.get_user_from_token(req.cookies.session)
        const is_admin = await funs.is_admin(username) 
        const on_connection_command_list =await funs.get_all_on_connection_commands();
            const auto_command_list =await funs.get_all_commands_db();
            JSON.stringify(on_connection_command_list)
        let list_users = await funs.list_all_users()
       for(i=0;i<list_users.length;i++){
        list_users[i].sessions = await funs.get_sessions_by_username(list_users[i].username)
       }
        if(is_admin){
            
                res.render(path.join(__dirname, "../pages/adminprofile.ejs"), {
                    username: await funs.get_user_from_token(req.cookies.session),
                    on_connection_command_list:on_connection_command_list,
                    auto_command_list:auto_command_list,
                    settings: config.settings,
                    list_users:list_users
                })
            return
        }
        
            res.render(path.join(__dirname, "../pages/profile.ejs"), {
                username: await funs.get_user_from_token(req.cookies.session),
                on_connection_command_list:on_connection_command_list,
                auto_command_list:auto_command_list,
                settings: config.settings
            })
            


    })
    router.post('/',funs.check_login_user,async function (req, res) {
        const login_data = await funs.login_db(await funs.get_user_from_token(req.cookies.session), req.body.old_password)
            if (!login_data) { // if password is not correct
                res.send("current password incorrect")
                return;
            } else { // if password is correct chnage it.
                funs.change_user_password_db(await funs.get_user_from_token(req.cookies.session), req.body.new_password, data => {
                    res.send("done")

                })
            }
    })
    return router;
}