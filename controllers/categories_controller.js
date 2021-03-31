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
        var sql = "select * from categories";
        var params = [];
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error": err.message});
            return;
            }
            res.json({
                "message":"success",
                "products":rows
            })
        });
    };

    exports.fetchAllParent = async function(_req, res, _next) {
        var sql = "select * from categories where id_parent = 0";
        var params = [];
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error": err.message});
            return;
            }
            res.json({
                "message":"success",
                "categories":rows
            })
        });
    };

    exports.fetchAllChildren = async function(req, res, _next) {
        var sql = "select * from categories where id_parent = ?";
        var params = req.params.id_parent;
        db.all(sql, params, (err, rows) => {
            if (err) {
            res.status(400).json({"error": err.message});
            return;
            }
            res.json({
                "message":"success",
                "categories":rows
            })
        });
    };

