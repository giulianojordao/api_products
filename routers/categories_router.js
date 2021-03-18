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

const categoriesCtrl = require('../controllers/categories_controller');

const tokenize = require('../middleware/middleware');

    router.get('/fetchAll', tokenize.verifyJWT, categoriesCtrl.fetchAll);
    router.get('/fetchAllParent', tokenize.verifyJWT, categoriesCtrl.fetchAllParent);
    router.get('/fetchAllChildren/:id_parent', tokenize.verifyJWT, categoriesCtrl.fetchAllChildren);

module.exports = router;
