/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    app.post('/sign-up/:email', function (req, res) {
        var body = "";
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
            //Parsing data transfer
            var userJSON = JSON.parse(body);

            async.waterfall([
                //Verify if user exists
                function (cb) {
                    User.find({email:req.params.email}, function (err, user) {
                        if (err) {
                            console.log("Error to find user");
                            res.end(config.SERVER.STATUS.ERROR);
                        }
                        else if (user.length) {
                            console.log("User already exist");
                            res.end(config.SERVER.STATUS.ERROR);
                        }
                        else {
                            cb(null, 'success');
                        }
                    });
                },

                //Save user
                function (string, cb) {
                    var userSchema = new User({
                        token: "MyToken",
                        name: userJSON.name,
                        email: userJSON.email,
                        password: userJSON.password,
                        followers: [],
                        followings: [],
                        posts: [],
                        isLogin: false
                    });

                    userSchema.save(function (err) {
                        if(err){
                            console.log("Error to create user");
                            res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                        }
                        else{
                            console.log("User created");
                            res.end(JSON.stringify(config.SERVER.STATUS.SUCCESS));
                            cb(null);
                        }
                    });
                }
            ]);
        });
    });
};