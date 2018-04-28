/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var postSchema = new Schema({
    imgURL: String,
    description: String,
    comments: [],
    likes: Number,
    date: Date
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;