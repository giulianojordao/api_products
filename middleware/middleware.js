//! Get environmet variables
require("dotenv-safe").config();

//! Environmental definitions 
const jwt = require("jsonwebtoken");
const db = require("../database/database_module");
var bodyParser = require("body-parser");

//! Get environmet variables
require("dotenv-safe").config();

module.exports = { 
    verifyJWT: function verifyJWT(req, res, next) {
        const token = req.headers['authorization'];

        if (!token){
            res.status(401).json({
                "message": "ACESSO NEGADO",
                "errors": {
                    "errorCode": 401,
                    "errorStatus": "ACESSO NEGADO",
                    "errorMessage": "ACESSO NEGADO"
                }
            });
        }else{
            var bearer = token.split(' ');
            var bearerToken = bearer[1];
        }

        jwt.verify(bearerToken, process.env.SECRET, function(err, decoded){
            if(err){
                res.status(401).json({
                    "message": "ACESSO NEGADO",
                    "errors": {
                        "errorCode": 401,
                        "errorStatus": "ACESSO NEGADO",
                        "errorMessage": "ACESSO NEGADO"
                    }
                });
            }else{
                req.id = decoded.id;
                next();
            }
        });
    }
};
