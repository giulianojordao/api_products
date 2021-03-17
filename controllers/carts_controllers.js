/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use strict';

const jwt = require('jsonwebtoken');

//* database link
var db = require("../database/database_module");
var md5 = require("md5");

    //! Authentication
    exports.fetchAll = async function (_req, res, _next) {
        var sqlQuery = "select * from carts";

        db.get(sqlQuery, function(err, row){
            if (err){
                res.status(401).json({
                    "message": (err !== null) ? err.message : "ERRO",
                    "errors": {
                        "errorCode": 401,
                        "errorStatus": (result !== undefined) ? result.message : "Informações inválidas",
                        "errorMessage": (err !== null) ? err.message : "ERRO"
                    }});
            } else {
                if (row === undefined){
                    res.status(200).json({
                        "data": null,
                        "errors": {
                            "errorCode": 200,
                            "errorStatus": "Não foram encontrados dados que atendam os critérios de consulta",
                            "errorMessage": "SEM DADOS"
                        }
                    });
                }else{
                    res.status(200).json({
                        "data": row,
                        "errors": {
                            "errorCode": 200,
                            "errorStatus": "Total rows: " + row.status,
                            "errorMessage": "Dados encontrados"
                        }
                    });
                }
            }
        });
    };
    exports.getByUser = async function (req, res, _next) {
        var sqlQuery = "SELECT * FROM carts WHERE iduser = ?";
        
        var params = [ req.params.iduser ];
        db.get(sqlQuery, params, function(err, row) {
            
            if (err && row !== undefined){
                res.status(401).json({
                    "message": (err !== null) ? err.message : "ERRO",
                    "errors": {
                        "errorCode": 401,
                        "errorStatus": (row !== undefined) ? row.message : "Informações inválidas",
                        "errorMessage": (err !== null) ? err.message : "ERRO"
                    }});
            } else {
                if (row === undefined){
                    res.status(200).json({
                        "data": null,
                        "errors": {
                            "errorCode": 200,
                            "errorStatus": "Não foram encontrados dados que atendam os critérios de consulta",
                            "errorMessage": "SEM DADOS"
                        }
                    });
                }else{
                    res.status(200).json({
                        "data": row,
                        "errors": {
                            "errorCode": 200,
                            "errorStatus": "Total rows: " + row.status,
                            "errorMessage": "Dados retornados"
                        }
                    });
                }
            }
        });
    };