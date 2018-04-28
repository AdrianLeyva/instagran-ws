/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    app.put('/logout/:email', function (req, res) {
        async.waterfall([
            //Verify if user exists
            function (cb) {
                User.find({email:req.params.email}, function (err, user) {
                    if(err || !user.length || user[0] === 'undefined'){
                        console.log("Error to find user");
                        res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                    }
                    else{
                        cb(null, user[0]);
                    }
                });
            },

            //Validate access token
            function (user, cb) {
                if(req.headers.authorization === "MyToken"){
                    cb(null, user)
                }
                else{
                    console.log("No authorized");
                    res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                }
            },

            //Login
            function (user, cb) {
                if(!user.isLogin){
                    console.log("The user is already logout");
                    res.end(config.SERVER.STATUS.ERROR);
                }
                else{
                    user.isLogin = false;
                    user.save(function (err) {
                        if(err){
                            console.log("Error to update user model");
                            res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                        }
                        else{
                            console.log("You are logout");
                            res.end(JSON.stringify(config.SERVER.STATUS.SUCCESS));
                            cb(null);
                        }
                    });
                }
            }
        ]);
    });
};