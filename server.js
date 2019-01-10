'use strict';

require('dotenv').load();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan  = require('morgan')

const app = express();

var port = process.env.PORT || 3000;

var mongoOptions = {
    useNewUrlParser: true,
    reconnectTries: 100,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
};

mongoose
    .connect(
        process.env.DB,
        mongoOptions
    )
    .then(
        () => {
            console.log('mongoDB connected');
        },
        (err) => {
            console.error(err);
        }
    );
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('short'));

//models
require('./app/model/user.model');

//routes
const user = require('./app/route/user.route');
const auth = require('./app/route/auth.route');

app.use('/api/users', user);
app.use('/api/auth', auth);

app.listen(port, (err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Server Running on ' + port);
});

