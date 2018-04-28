/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    app.get('/show-profile/:email', function (req, res) {

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

            //get profile
            function (user, cb) {
                console.log("Show user profile");
                res.end(JSON.stringify(user));
                cb(null);
            }
        ]);
    });
};
