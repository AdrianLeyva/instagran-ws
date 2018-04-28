/**
 * Created by adrianaldairleyvasanchez on 4/28/18.
 */
//Modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("./user");

var commentSchema = new Schema({
    content: String,
    user: User.schema,
    date: Date
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;