'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const router = express.Router();

var VerifyToken = require('../middleware/verifyJWTToken');
var minimumPermissionLevel = require('../middleware/minimumPermissionLevel');

router.get('/', VerifyToken, minimumPermissionLevel(['admin', 'user']), (req, res) => {
    User.find()
        .then((users) => {

            users.forEach((user, i) => {
                user = user.toJSON();
                delete user.__v;
                delete user.password;
                users[i] = user
            });
            
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
});

router.get('/:id', VerifyToken, minimumPermissionLevel(['admin', 'user']), (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if(user){
                user = user.toJSON();
                delete user.__v;
                delete user.password;
                res.status(200).json(user);
            } else {
                res.status(500).send({ message: 'Invalid user id' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
});

router.post('/', (req, res) => {
    var user = new User(req.body);
    user.role = 'user';
    user.password = bcrypt.hashSync(user.password, 10);
    user
        .save()
        .then((user) => {
            user = user.toJSON();
            delete user.__v;
            delete user.password;
            res.status(200).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
});

router.put('/:id', VerifyToken, minimumPermissionLevel(['user', 'admin']), (req, res) => {
    if (req.body.password)
        req.body.password = bcrypt.hashSync(req.body.password, 10);

    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then((user) => {
            if(user){
                user = user.toJSON();
                delete user.__v;
                delete user.password;
                res.status(200).json(user);
            } else {
                res.status(500).send({ message: 'Invalid user id' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
});

router.delete('/:id', VerifyToken, minimumPermissionLevel(['admin']), (req, res) => {
    User.findOneAndDelete({ _id: req.params.id })
        .then((result) => {
            if(result)
                res.sendStatus(200);
            else
                res.status(500).send({ message: 'Invalid user id' });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        });
});

module.exports = router;