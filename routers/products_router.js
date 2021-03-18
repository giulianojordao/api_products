/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use strict';

const express = require('express');
const router = express.Router();
var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const productsCtrl = require('../controllers/products_controller');

const tokenize = require('../middleware/middleware');

    router.get('/fetchAll', tokenize.verifyJWT, productsCtrl.fetchAll);
    // router.get('/getUser/:id', tokenize.verifyJWT, usersCtrl.getUser);

    // router.post('/addUser', tokenize.verifyJWT, usersCtrl.addUser);
    // router.delete('/deleteUser/:id', tokenize.verifyJWT, usersCtrl.deleteUser);
    // router.patch('/updateUser', tokenize.verifyJWT, usersCtrl.updateUser);

module.exports = router;
