/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const async = require('async');
const config = require("../../config/configuration");

module.exports = function (app, mongoose) {

    var userModel = require('../../models/user');
    var User = mongoose.model('User', userModel.schema);

    var postModel = require('../../models/post');
    var Post = mongoose.model('Post', postModel.schema);

    app.post('/post-img/:email', function (req, res) {
        var body = "";
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
            //Parsing data transfer
            var postJSON = JSON.parse(body);

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

                //post image
                function (user, cb) {
                    user.posts.push(new Post({
                        imgURL: postJSON.imgURL,
                        description: postJSON.description,
                        comments: [],
                        likes: 0,
                        date: new Date()
                    }));

                    user.save(function (err) {
                        if (err) {
                            console.log("Error to update user model");
                            res.end(JSON.stringify(config.SERVER.STATUS.ERROR));
                            cb(null);
                        }
                        else{
                            console.log("Image was posted");
                            res.end(JSON.stringify(config.SERVER.STATUS.SUCCESS));
                            cb(null);
                        }
                    });
                }
            ]);
        });
    });
};