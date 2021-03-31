/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use strict';

const jwt = require('jsonwebtoken');

//* database link
var db = require("../database/database_module");
var md5 = require("md5");
const { fetchAll } = require('./carts_controllers');

async function getTokenData (req, callback) {
    var tokenSecret = process.env.SECRET;
    const token = req.headers['authorization'];

    var bearer = token.split(' ');
    var bearerToken = bearer[1];

    var idUsuario = jwt.verify(bearerToken,tokenSecret, function(err, decoded){
        if (err){
            return null;
        }else{
            return decoded.id;
        }
    });

    callback(idUsuario);
}
    //! Authentication
    exports.login = async function (req, res, _next) {
        var cpf = req.body.cpf;
        var password = md5(req.body.password);
        var tokenSecret = process.env.SECRET;

        var sqlQuery = "select * from users where cpf = ? AND password = ?";
        var params = [ cpf, password ];

        db.get(sqlQuery, params, function(err, result){
            if (err || result === undefined){
                res.status(401).json({
                    "message": (err !== null) ? err.message : "ERRO",
                    "errors": {
                        "errorCode": 401,
                        "errorStatus": (result !== undefined) ? result.message : "Informações inválidas",
                        "errorMessage": (err !== null) ? err.message : "ERRO"
                    }});
            } else {
                const id = result?.id;
                const token = jwt.sign({id}, tokenSecret, {
                    expiresIn: 3000
                });

                var now = new Date();
                now.setSeconds(now.getSeconds() + 3000);

                res.status(200).json({
                    "auth": true, 
                    "token": token, 
                    "loggedUser": result,
                    "expiresIn": now.toString(), 
                    "message": "AUTHENTICATION OK",
                    "errors": {
                        "errorCode": 200,
                        "errorStatus": "ACESSO GARANTIDO",
                        "errorMessage": "ACESSO GARANTIDO"
                    }
                });
            }
        });
    };

    exports.logout = async function(_req, res, _next) {
        res.status(200).json({
            "auth": false, 
            "token": null, 
            "message": "LOGOUT OK",
            "errors": {
                "errorCode": 200,
                "errorStatus": "ACESSO REMOVIDO",
                "errorMessage": "ACESSO REMOVIDO"
            }
        });
    };

    exports.getTokenData = getTokenData

    //! PUT HERE ALL THE API Endpoints
    exports.fetchAll = async function(_req, res, _next) {
        var sql = "select * from users";
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
    }


    exports.getUser = async function(req, res, _next) {
        var sqlQuery = "select * from users where id = ?";
        var idUsuario = null;
        
        getTokenData(req, (id) => {
            idUsuario = id;
        });

        if(idUsuario != null){

        db.get(sqlQuery, idUsuario, (err, row) => {
            if(err){
                res.status(400).json(
                    {
                        "message": err.message,
                        "errors": {
                            "errorCode": 400,
                            "errorStatus": "Erro no acesso aos dados",
                            "errorMessage": "ERRO NO ACESSO"
                        }
                });
            } else {
                res.status(200).json(
                    {
                        "message": "OK",
                        "data": row,
                        "errors": {
                            "errorCode": 200,
                            "errorStatus": "OK",
                            "errorMessage": "DADOS ENVIADOS"
                        }
                });
            }
        });
    }
    else{
        res.status(400).json(
            {
                "message": err.message,
                "errors": {
                    "errorCode": 400,
                    "errorStatus": "Erro no acesso aos dados",
                    "errorMessage": "ERRO NO ACESSO"
                }
        });
    }
    }

    exports.addUser = async function(req, res, _next) {
        var errors = [];
        if(!req?.body){
            errors.push("Dados Não informados");
        }
        if(!req?.body?.fullname){
            errors.push("Nome do usuário não informado");
        }
        if(!req?.body?.email){
            errors.push("Email do usuário não informado");
        }
        if(!req?.body?.cpf){
            errors.push("CPF do usuário não informado");
        }
        if(!req?.body?.cellphone){
            errors.push("Celular do usuário não informado");
        }
        if(!req?.body?.password){
            errors.push("Senha do usuário não informada");
        }
        if(!req?.body?.wallet){
            errors.push("Wallet do usuário não informada");
        }
        if(!req?.body?.deviceid){
            errors.push("DeviceID do usuário não informado");
        }

        if(errors.length > 0){
            res.status(400).json({
                "message": "Erro nos dados fornecidos",
                        "errors": {
                            "errorCode": 400,
                            "errorStatus": "Erro nos dados fornecidos",
                            "errorMessage": errors.join(", ")
                        }
            });
        }
        var bodyData = {
            fullname : req.body.fullname, 
            email: req.body.email,
            cpf: req.body.cpf,
            cellphone : req.body.cellphone,
            password : md5(req.body.password), 
            wallet: req.body.wallet,
            deviceid: req.body.deviceid
        };

        var sqlInsert = 'INSERT INTO users (fullname, email, cpf, cellphone, password, wallet, deviceid) VALUES(?,?,?,?,?,?,?)';
        var insertData = [ bodyData.fullname, bodyData.email, bodyData.cpf, bodyData.cellphone, bodyData.password, bodyData.wallet, bodyData.deviceid];

        db.run(sqlInsert, insertData, function(err, result){
            if(err){
                res.status(400).json({
                    "message": "Erro na inserção dos dados",
                "errors": {
                    "errorCode": 400,
                    "errorStatus": err.message,
                    "errorMessage": err.message
                }});
            } else {
                res.status(200).json({
                    "message": "OK",
                    "data": bodyData,
                    "id": this.lastID, 
                    "errors": {
                        "errorCode": 200,
                        "errorStatus": "Dados inseridos com sucesso",
                        "errorMessage": "INSERT OK"
                    }
                });
            }
        });

    }

    exports.deleteUser = async function(req, res, _next) {
        var errors = [];
        if(!req?.params){
            errors.push("Dados Não informados");
        }

        if(!req?.params?.id){
            errors.push("ID do usuário não informado");
        }

        if(errors.length > 0){
            res.status(400).json({
                "message": "Erro nos dados fornecidos",
                        "errors": {
                            "errorCode": 400,
                            "errorStatus": "Erro nos dados fornecidos",
                            "errorMessage": errors.join(", ")
                        }
            });
        }

        var sqlDelete = "DELETE FROM users WHERE id = ?";
        var params = req.params.id;


        db.run(sqlDelete, params, function(err, _result){
            if(err){
                res.status(400).json({
                    "message": "Erro no delete",
                            "errors": {
                                "errorCode": 400,
                                "errorStatus": err.message,
                                "errorMessage": res.message
                            }
                });
            }else{
                res.status(200).json({
                    "message": "OK",
                    "changes": this.changes,
                    "errors": {
                        "errorCode": 200,
                        "errorStatus": "Cliente removido com sucesso",
                        "errorMessage": "DELETE OK"
                    }
                });
            }
        })
    };

    exports.updateUser = async function(req, res, _next) {
        var bodyData = {
            fullname : req.body.fullname, 
            cellphone : req.body.cellphone,
            password : md5(req.body.password),
            id: req.body.id
        };

        var sqlUpdate = `UPDATE users SET 
                fullname = COALESCE(?, fullname),
                cellphone = COALESCE(?, cellphone),
                password = COALESCE(?, password) 
                WHERE id = ?`;

        var params = [
            bodyData.fullname, bodyData.cellphone, bodyData.password, bodyData.id
        ];

        db.run(sqlUpdate, params, function(err, _result){
            if(err){
                res.status(400).json({
                    "message": "Erro no update",
                            "errors": {
                                "errorCode": 400,
                                "errorStatus": err.message,
                                "errorMessage": res.message
                            }
                });
            }else{
                res.status(200).json({
                    "message": "OK",
                    "data": bodyData,
                    "changes": this.changes,
                    "errors": {
                        "errorCode": 200,
                        "errorStatus": "Cliente alterado com sucesso",
                        "errorMessage": "UPDATE OK"
                    }
                });
            }
        });

    };
