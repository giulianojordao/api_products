  
/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use strict';

const express = require('express');
const router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const cartsCtrl = require('../controllers/carts_controllers');

const tokenize = require('../middleware/middleware');

router.get('/fetchAll', tokenize.verifyJWT, cartsCtrl.fetchAll);
router.get('/getByUser/:iduser', tokenize.verifyJWT, cartsCtrl.getByUser);

module.exports = router;
