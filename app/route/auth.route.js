'use strict';

require('dotenv').load();

const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
var jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', (req, res) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            
            User.findOne({ email: req.body.email })
                .then((user) => {
                    
                    if(bcrypt.compareSync(req.body.password, user.password)){
                        var token = jwt.sign({ id: user._id, role: user.role }, process.env.secret, {
                            expiresIn: 86400 // expires in 24 hours
                          });
                        res.status(200).send({ auth: true, token: token });
                    } else {
                        return res.status(400).send({errors: 'Incorrect password field'});
                    }

                })
                .catch((err) => {
                    return res.status(400).send({errors: 'Incorrect email field'});
                });

        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }

});

router.get('/', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;