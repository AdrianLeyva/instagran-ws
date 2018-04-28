/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require("./post");


var userSchema = new Schema({
    token: String,
    name: String,
    email: String,
    password: String,
    followers: [],
    followings: [],
    posts: [Post.schema],
    isLogin: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;