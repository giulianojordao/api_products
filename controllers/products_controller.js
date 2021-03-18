/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use strict';

const jwt = require('jsonwebtoken');

//* database link
var db = require("../database/database_module");
var md5 = require("md5");

    //! PUT HERE ALL THE API Endpoints
    exports.fetchAll = async function(_req, res, _next) {
        var sql = "select * from products";
        var params = [];
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error": err.message});
            return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
        });
    };

