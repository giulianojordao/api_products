var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err){
        //! Error trying to access database (open database)
        console.info("FAKEAPI: [INFO] " + err.message);
        throw err;
    }else{
        console.log("FAKEAPI_PRODUTO: [INFO] Conectado a base de dados");
        //! Creating `users` table
        db.run(`CREATE TABLE users (
            id INTEGER NOT NULL UNIQUE,
            fullname text,
            email text UNIQUE,
            cpf text UNIQUE,
            cellphone text,
            password text,
            wallet text UNIQUE,
            deviceid text UNIQUE,
            CONSTRAINT email_unique UNIQUE(email),
            CONSTRAINT cpf_unique UNIQUE(cpf),
            CONSTRAINT wallet_unique UNIQUE(wallet),
            CONSTRAINT deviceid_unique UNIQUE(deviceid),
            PRIMARY KEY(id AUTOINCREMENT)
        )`,(err) => {
            if(err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }else{
                //! Table is just created... lets populate some fake data
                var sqlInsert = `INSERT INTO users (
                    fullname, 
                    email, 
                    cpf, 
                    cellphone, 
                    password,
                    wallet,
                    deviceid) values(?,?,?,?,?,?,?)`;
                db.run(sqlInsert, [
                    "admin", 
                    "admin@teste.com.br", 
                    "00000000191", 
                    "62999223438", 
                    md5("naosei"),
                    "1234-1234-1234-1234",
                    "device1"]);
                db.run(sqlInsert, [
                    "user", 
                    "user@teste.com.br", 
                    "00000000192", 
                    "62999223439", 
                    md5("naosei"),
                    "2345-2345-2345-2345",
                    "device2"]);
                db.run(sqlInsert, [
                    "emilson", 
                    "emilson.silva@trinusco.com.br", 
                    "00000000193", 
                    "62999223439", 
                    md5("naosei"),
                    "1111-2222-3333-4444",
                    "device3"]);
                db.run(sqlInsert, [
                    "rodrigo", 
                    "rodrigo.nunes@trinusco.com.br", 
                    "00000000194", 
                    "62999223439", 
                    md5("naosei"),
                    "2222-3333-4444-5555",
                    "device4"]);
                db.run(sqlInsert, [
                    "rogerio", 
                    "rogerio.felix@trinusco.com.br", 
                    "00000000195", 
                    "62999223439", 
                    md5("naosei"),
                    "3333-4444-5555-6666",
                    "device5"]);
            }
        });

        //! Creating `categories` table
        db.run(`CREATE TABLE categories (
            id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            id_parent INTEGER NOT NULL DEFAULT 0,
            description TEXT NOT NULL,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if(err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }else{
                var sqlInsert = `INSERT INTO categories (name, id_parent, description) VALUES (?,?,?)`;
                db.run(sqlInsert, [
                    "Alimentos", 
                    0, 
                    "Alimentos em geral"]);
                db.run(sqlInsert, [
                    "Bebidas", 
                    0, 
                    "Bebidas em geral"]);
                db.run(sqlInsert, [
                    "Limpeza", 
                    0, 
                    "Material de limpeza"]);
                db.run(sqlInsert, [
                    "Cereais", 
                    1, 
                    "Grãos e cereais"]);
                db.run(sqlInsert, [
                    "Laticínios", 
                    1, 
                    "Derivados do leite"]);
                db.run(sqlInsert, [
                    "Refrigerantes", 
                    3, 
                    "Bebidas gasosas e refrigerantes"]);
                db.run(sqlInsert, [
                    "Cervejas", 
                    3, 
                    "Cervejas nacionais e importadas"]);
        }
        });
        
        //! Creating `products` table
        db.run(`CREATE TABLE products (
            id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            longdesc TEXT NOT NULL,
            image BLOB,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err) {
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            } else {
                var sqlInsert = `INSERT INTO products (name, description, longdesc) VALUES (?,?,?)`;
                db.run(sqlInsert, [
                    "Coca-cola lata", 
                    "Refrigerante Coca-Cola, sabor original em embalagem de 350ml (lata) não retornável.", 
                    "Curabitur sollicitudin ipsum eget eleifend aliquet. Morbi ac sodales nunc. Donec quis dictum diam. Fusce facilisis, metus ac auctor tempus, leo sapien dapibus neque, sit amet placerat enim velit in massa. Duis aliquam, tellus sit amet imperdiet ultricies, lorem nunc viverra metus, sit amet dapibus purus ex et metus. Praesent at aliquet sapien, et accumsan orci. Vestibulum vel placerat enim. Morbi non fringilla enim, non mattis nisl."
                ]);
                db.run(sqlInsert, [
                    "Coca-Cola 2 litros", 
                    "Refrigerante Coca-Cola, sabor original em embalagem pet de 2l não retornável.", 
                    "Curabitur sollicitudin ipsum eget eleifend aliquet. Morbi ac sodales nunc. Donec quis dictum diam. Fusce facilisis, metus ac auctor tempus, leo sapien dapibus neque, sit amet placerat enim velit in massa. Duis aliquam, tellus sit amet imperdiet ultricies, lorem nunc viverra metus, sit amet dapibus purus ex et metus. Praesent at aliquet sapien, et accumsan orci. Vestibulum vel placerat enim. Morbi non fringilla enim, non mattis nisl."
                ]);
            }
        });

        //! Creating `categories_products` table
        db.run(`CREATE TABLE categories_products (
            id INTEGER NOT NULL UNIQUE,
            idcategory INTEGER NOT NULL,
            idproduct INTEGER NOT NULL,
            spotted INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if(err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }else{
                var sqlInsert = `INSERT INTO categories_products(idcategory, idproduct, spotted) VALUES (?,?,?)`;
                db.run(sqlInsert, [6,1,0]);
                db.run(sqlInsert, [6,2,1]);
            }
        });

        //! Creating `carts` table
        db.run(`CREATE TABLE carts (
            id INTEGER NOT NULL UNIQUE,
            iduser INTEGER NOT NULL,
            totalvalue NUMERIC NOT NULL,
            vat NUMERIC NOT NULL DEFAULT 0,
            status INTEGER NOT NULL DEFAULT 1,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }
        });

        //! Creating `carts_products` table
        db.run(`CREATE TABLE carts_products (
            id INTEGER NOT NULL UNIQUE,
            idcart INTEGER NOT NULL,
            idproduct INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            partialvalue NUMERIC NOT NULL,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }
        });

        //! Creating `carts_users` table
        db.run(`CREATE TABLE carts_users (
            id INTEGER NOT NULL UNIQUE,
            idcart INTEGER NOT NULL,
            iduser INTEGER NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            }
        });

        //! Creating `stores` table
        db.run(`CREATE TABLE stores (
            id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            status INTEGER NOT NULL DEFAULT 1,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            } else {
                var sqlInsert = `INSERT INTO stores (name, status) VALUES (?,?)`;
                db.run(sqlInsert, ["Central", 1]);
                db.run(sqlInsert, ["Filial MG", 1]);
            }
        });

        //! Creating table `stores_products`
        db.run(`CREATE TABLE stores_products (
            id INTEGER NOT NULL UNIQUE,
            idstore INTEGER NOT NULL,
            idproduct INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            minquantity INTEGER NOT NULL DEFAULT 1,
            warninglevel INTEGER NOT NULL DEFAULT 1,
            PRIMARY KEY(id AUTOINCREMENT)
        )`, (err) => {
            if (err){
                //! TABLE Already exists
                console.info("FAKEAPI: [INFO] " + err.message);
            } else {
                var sqlInsert = `INSERT INTO stores_products (idstore, idproduct, quantity, minquantity, warninglevel) VALUES (?,?,?,?,?)`;
                db.run(sqlInsert, [1,1,100,20,10]);
                db.run(sqlInsert, [2,1,200,10,10]);
                db.run(sqlInsert, [1,2,200,10,10]);
                db.run(sqlInsert, [2,2,100,10,10]);
            }
        });
    }
});

module.exports = db;