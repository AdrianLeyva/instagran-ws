/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    app.put('/follow-friend/:email/:friendEmail', function (req, res) {

        async.waterfall([
            //Verify if user exists
            function (cb) {
                User.find({email:req.params.email}, function (err, user) {
                    if(err || !user.length || user[0] === 'undefined'){
                        console.log("Error to find user");
                        res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                        cb(null);
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
                    cb(null);
                }
            },

            //Follow friend
            function (user, cb) {
                var mUserModel = require('../../models/user');
                var FriendUser = mongoose.model('User', mUserModel.schema);

                FriendUser.find({email:req.params.friendEmail}, function (err, friend) {
                    if(err || !friend.length || friend[0] === 'undefined'){
                        console.log("Error to find user");
                        res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                        cb(null);
                    }
                    else{
                        friend[0].followers.push({
                            username: user.name,
                            email: user.email
                        });
                        friend[0].save(function (err) {
                            if(err){
                                console.log("Error to update user model");
                                res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                                cb(null);
                            }
                            else{
                                console.log("You are following to your friend");
                                cb(null, friend[0], user);
                            }
                        });
                    }
                });
            },

            //Update your followings
            function (friend, user, cb) {
                user.followings.push({
                    username: friend.name,
                    email: friend.email
                });
                user.save(function (err) {
                    if(err){
                        console.log("Error to update user model");
                        res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                        cb(null);
                    }
                    else{
                        console.log("Your followings are updated");
                        res.end(JSON.stringify(config.SERVER.STATUS.SUCCESS));
                        cb(null);
                    }
                });
            }
        ]);
    });
};