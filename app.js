const http = require("http");
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
const port = process.env.PORT || 5000;
const fs = require("fs");
const express = require("express");
const app = express();
const session = require('express-session')
const formidable = require('formidable');
const util = require('util');
const crypto = require('crypto');

var connectionProperties = {
    user: process.env.DBAAS_USER_NAME || "veronicachirut",
    password: process.env.DBAAS_USER_PASSWORD || "12veronica34",
    connectString: process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "193.226.51.37:1521/o11g"
};

function doRelease(connection) {
    connection.release(function (err) {
        if (err) {
            console.error(err.message);
        }
    });
};

app.set("view engine", "ejs");
app.use(express.static("public"));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({ type: '*/*' }));
//nu decomentati alea doua linii ca imi strica citirea din formulare

app.use(session({
    secret: 'abcdefg',//asta e pt login
    resave: true,
    saveUninitialized: false
}));

app.get("/", function (req, res) {
    res.render("html/index", {user: req.session.username});
});

app.get("/login", function (req, res) {
    res.render("html/login", {});
});

app.get("/dashboard", function (req, res) {
    res.render("html/dashboard", {user: req.session.username});
})

app.get("/register", function (req, res) {
    res.render("html/register", {});
});

app.post("/register", function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            console.log("After connection register");
            var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
            var encrPass= cipher.update(fields.pass, 'utf8', 'hex');
            encrPass += cipher.final('hex');
            var dbRequest = "insert into users (username, email, password, full_name) values ('" + fields.username + "', '" + fields.email + "', '" + encrPass + "', '" + fields.fname + "')";
            console.log("Cererea: " + dbRequest);
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error getting data from DB");
                        doRelease(connection);
                        return;
                    }
                    console.log(result);
                    doRelease(connection);
            });
            connection.execute("commit", {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error getting data from DB");
                        doRelease(connection);
                        return;
                    }
                    console.log(result);
                    doRelease(connection);
            });
            res.render('html/index');
        });
    });
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    console.log("User logged out");
    res.render('html/logout');
});

app.post('/login', function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("ruleaza pana aici");
    var control = 0;
    form.parse(req, function(err, fields, files) {
        //fields.username si fields.pass
        console.log("acces db login");
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            console.log("After connection useri");
            var dbRequest = "SELECT * FROM users WHERE username = '" + fields.username + "'";
            console.log("Cererea: " + dbRequest);
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error getting data from DB");
                        doRelease(connection);
                        return;
                    }
                    console.log(result);
                    console.log("parola: " + fields.pass);
                    var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
                    var encrPass = cipher.update(fields.pass, 'utf8', 'hex');
                    encrPass += cipher.final('hex');
                    result.rows.forEach(function (element) {
                        console.log("elem pass: " + element.PASSWORD);
                        if (element.PASSWORD == encrPass){
                            //aici trebuie neaparat cu litere mari pt ca altfel nu face verificarea cum trb, imi pare rau de coding style :))
                            // e okay, nu sunt un coding style nazi :))))
                            console.log("User gasit si parola corecta");
                            control = 1;
                        }
                        else {
                            console.log("Parola gresita");
                        }
                    }, this);
                    doRelease(connection);
                    if (control == 1){
                        req.session.username = fields.username;
                        console.log("am setat sesiunea");
                    }
                    console.log("ne-am logat");
                    res.redirect('/index');
            });
        });
    });
});

app.get("/index", function (req, res) {
    res.render("html/index", {user: req.session.username});
});

app.get("/filme", function(req, res) {
    res.render("html/filme", {user: req.session.username});
});

var router = express.Router();
router.route('/movies/').get(function (request, response) {
    console.log("GET MOVIES");
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
        }
        console.log("After connection");
        connection.execute("SELECT * FROM filme", {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    response.status(500).send("Error getting data from DB");
                    doRelease(connection);
                    return;
                }
                var filme = [];
                result.rows.forEach(function (element) {
                    filme.push({
                        id: element.FILM_ID,
                        numeFilm: element.NUME_FILM,
                        genFilm: element.GEN_FILM,
                        regizori: element.REGIZORI,
                        actori: element.ACTORI,
                        linkTrailer: element.LINK_TRAILER,
                        linkAfis: element.LINK_AFIS,
                        descriere: element.DESCRIERE,
                        durata: element.DURATA,
                        limbaOriginala: element.LIMBA_ORIGINALA,
                        anAparitie: element.AN_APARITIE
                    });
                }, this);
                response.json(filme);
                doRelease(connection);
            });
    });
});

app.get("/povestea", function(req, res) {
    res.render("html/povestea", {user: req.session.username});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {user: req.session.username});
});

app.use(express.static('static'));
app.use('/', router);
app.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});