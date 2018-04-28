/**
 * Created by adrianaldairleyvasanchez on 4/27/18.
 */
//Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require("./app/config/configuration");
const boot = require("./app/helpers/booter");

//Defining port
var port = process.env.PORT || config.SERVER.PORT;

//Database connection
mongoose.connect(config.DATABASE.URL);
var database = mongoose.connection;

database.on('error', function (){
    console.error.bind(console, 'connection error:');
    mongoose.disconnect();
});

database.once('open', function(){
    app.listen(port,function () {
        boot(app, mongoose);
        console.log('Server running in: ' + config.SERVER.HOST + ':' + port);
    });
});