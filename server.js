/* eslint-disable no-redeclare */
/* eslint-disable no-path-concat */
/* jslint node: true */
/* jshint -W097 */
/* jshint esversion: 6 */
'use static';

//! Get environmet variables
require("dotenv-safe").config();

//! Creating the express app 
const express = require("express");
var bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

//! Environmental definitions 
var fs = require("fs");
var http = require("http");
var https = require("https");
const { urlencoded } = require("express");

const app = express();
var cors = require('cors');

//* database link
var db = require("./database/database_module");
var md5 = require("md5");

var tokenize = require('./middleware/middleware');


//! Routers
const usersRouter = require('./routers/users_router');
const cartsRouter = require('./routers/carts_router');
const categoriesRouter = require('./routers/categories_router');
const productsRouter = require('./routers/products_router');

//! Enabling HTTPS
var privateKey = fs.readFileSync("certs/serverkey.pem");
var certificate = fs.readFileSync("certs/servercert.pem");

var credentials = { 
    key: privateKey, 
    cert: certificate,
    passphrase: 'naosei'
};

//! Server attributes
var HTTP_PORT = process.env.HTTP_PORT;
var HTTPS_PORT = process.env.HTTPS_PORT;


//! Enabling both HTTP and HTTPS protocols
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

var tools = require('./shared/utils/general_functions');

//! Enabling CORS
app.use(
    cors({
        credentials: true,
        origin: true
    })
);

app.options('*', cors());
  
//! Enabling SWAGGER
var subpath = express();

app.use(
  bodyParser.json({
    limit: '50mb'
  })
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  })
);

app.use('', subpath);

var swagger = require('swagger-node-express').createNew(subpath);

app.use(express.static('swagger'));

//! Configuring the Swagger api settings
swagger.setApiInfo({
    title: 'Fake API',
    description: 'Restful Fake Api with SqlLite in NodeJs',
    termsOfServiceUrl: 'http://localhost:' + HTTPS_PORT + '/',
    contact: 'giulianojordao@gmail.com',
    license: 'Copyright © 2021 Scrumlab; Todos os direitos reservados.',
    licenseUrl: 'https://fakeapi.scrumlab.com.br/'
  });

//! Set api-doc path
// swagger.setAppHandler(app);
swagger.configureSwaggerPaths('', 'swagger', '');

//! Configure the API domain
var domain = 'localhost';

if (process.env.DOMAIN !== undefined) { 
    domain = process.env.DOMAIN;
} else {
  console.log(
    'No --domain=xxx specified, taking default hostname "localhost".'
  );
}

//! Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + HTTPS_PORT;
var applicationUrlSSL = 'https://' + domain + ':' + HTTPS_PORT;

swagger.configure(applicationUrl, '1.0.0');
swagger.configure(applicationUrlSSL, '1.0.0');

//! Use bodyparser
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

//! Main route definitions
app.get('/', tokenize.verifyJWT, function (req, res) {
    res.sendFile(__dirname + '/swagger/index.html');
});

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/products', productsRouter);

//! Starting the server
http.createServer(app).listen(HTTP_PORT, function() {
    console.info("FAKEAPI_PRODUTOS running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

https.createServer(credentials, app).listen(HTTPS_PORT, function() {
    console.info("FAKEAPI_PRODUTOS running on port %PORT%".replace("%PORT%", HTTPS_PORT))
});

app.set('view engine', 'ejs');