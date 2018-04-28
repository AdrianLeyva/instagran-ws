/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    app.put('/unfollow-friend/:email/:friendEmail', function (req, res) {

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

            //Unfollow friend
            function (user, cb) {
                user.followings.forEach(function (item, index, array) {
                    if(item.email === req.params.friendEmail){
                        array.splice(index, 1);
                        user.save();
                        console.log("Unfollow friend");
                        cb(null, user);
                    }
                });
            },

            //Update friend's followers
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
                        friend[0].followers.forEach(function (item, index, array) {
                            if(item.email === user.email){
                                array.splice(index, 1);
                                friend[0].save();
                                console.log("Update friend's followers");
                                res.end(JSON.stringify(config.SERVER.STATUS.SUCCESS));
                                cb(null);
                            }
                        });
                    }
                });
            }
        ]);
    });
};