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
const url = require('url');

oracledb.autoCommit = true;

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

app.use(session({
    secret: 'abcdefg',//asta e pt login
    resave: true,
    saveUninitialized: false
}));
app.get("/choose", function(req, res) {
    res.render("html/choose", {});
});
app.get("/locuri", function(req, res) {
    res.render("html/locuri", {});
});
app.get("/", function (req, res) {
    res.render("html/index", {user: req.session.username});
});

app.get("/login", function (req, res) {
    res.render("html/login", {});
});

app.get("/dashboard", function (req, res) {
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }
        if (req.session.username){
            var dbRequest = "SELECT * FROM users WHERE username = '" + req.session.username + "'";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Eroare");
                        doRelease(connection);
                        return;
                    }
                    result.rows.forEach(function (element) {
                        ret = {name: element.FULL_NAME, email: element.EMAIL};
                    }, this);
                    doRelease(connection);
                    console.log("Got user data");
                    console.log(ret);
                    res.render("html/dashboard", {user: req.session.username, userData: ret});
            });
        }
        else {
            doRelease(connection);
            res.render("html/dashboard", {user: req.session.username});
        }
    });
})

app.get("/register", function (req, res) {
    res.render("html/register", {});
});

app.post("/register", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0; //nicio problema
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
            var encrPass= cipher.update(fields.pass, 'utf8', 'hex');
            encrPass += cipher.final('hex');
            var dbRequest = "insert into users (username, email, password, full_name) values ('" + fields.username + "', '" + fields.email + "', '" + encrPass + "', '" + fields.fname + "')";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        if (err.message.localeCompare("ORA-00001: unique constraint (VERONICACHIRUT.USERS_UK2) violated") == 0){
                            control = 1; //username deja utilizat
                        } else if (err.message.localeCompare("ORA-00001: unique constraint (VERONICACHIRUT.USERS_UK1) violated") == 0){
                            control = 2; //adresa email deja utilizata
                        } else {
                            control = -1;
                        }
                        res.render('html/register', {cntl: control});
                        doRelease(connection);
                        return;
                    }
                    doRelease(connection);
                    console.log("User registered successfully");
                    if (control == 0){
                        res.redirect('index');
                    }
            });
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
    var control = 0; //cod prestabilit pentru eroare generala de autentificare
    form.parse(req, function(err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            var dbRequest = "SELECT * FROM users WHERE username = '" + fields.username + "'";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error getting data from DB");
                        doRelease(connection);
                        return;
                    }
                    var cipher = crypto.createCipher('aes-128-cbc', 'mypassword');
                    var encrPass = cipher.update(fields.pass, 'utf8', 'hex');
                    encrPass += cipher.final('hex');
                    if (result.rows.length == 0){
                        control = 3; //username-ul nu a fost gasit in baza de date
                    }
                    result.rows.forEach(function (element) {
                        if (element.PASSWORD == encrPass){
                            //aici trebuie neaparat cu litere mari pt ca altfel nu face verificarea cum trb, imi pare rau de coding style :))
                            // e okay, nu sunt un coding style nazi :))))
                            // ms pwp apreciez
                            control = 1; //date de logare valide
                        }
                        else {
                            console.log("User tried to log in with wrong password");
                            control = 2; //userul exista dar parola gresita
                        }
                    }, this);
                    doRelease(connection);
                    if (control == 1){
                        req.session.username = fields.username;
                        console.log("User logged in");
                        res.redirect('/index');
                    } else {
                        res.render("html/login", {cntl: control});
                    }
            });
        });
    });
});

app.get("/index", function (req, res) {
    res.render("html/index", {user: req.session.username});
});

app.get("/filme", function (req, res) {
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
                 // Merge sa dam split fix cand citim din db, yay
                function classes(genres) {
                    s = "";
                    genres = genres.split(", ");
                    for (let i of genres) {
                        s += i + " ";
                    }
                    return s;
                }

                var movies = [];
                result.rows.forEach(function (element) {
                    movies.push({
                        id: element.FILM_ID,
                        name: element.NUME_FILM,
                        genre: classes(element.GEN_FILM),
                        director: element.REGIZORI,
                        actor: element.ACTORI,
                        trailer: element.LINK_TRAILER,
                        poster: element.LINK_AFIS,
                        desc: element.DESCRIERE,
                        time: element.DURATA,
                        lang: element.LIMBA_ORIGINALA,
                        year: element.AN_APARITIE
                    });
                }, this);
                doRelease(connection);
                console.log("Got movies data");
                res.render("html/filme", { user: req.session.username, moviesData: movies });
            });
    });
});

app.get("/film", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }
        if (id) {
            var dbRequest = "SELECT * FROM filme WHERE film_id = '" + id + "'";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                        doRelease(connection);
                        return;
                    }
                    result.rows.forEach(function (element) {
                        ret = {
                            name: element.NUME_FILM,
                            genre: element.GEN_FILM,
                            director: element.REGIZORI,
                            actor: element.ACTORI,
                            trailer: element.LINK_TRAILER,
                            poster: element.LINK_AFIS,
                            desc: element.DESCRIERE,
                            time: element.DURATA,
                            lang: element.LIMBA_ORIGINALA,
                            year: element.AN_APARITIE
                        };
                    }, this);
                    doRelease(connection);
                    console.log("Got movie data");
                    console.log(ret);
                    res.render("html/film", { user: req.session.username, movieData: ret });
                });
        } else {
            var ret = { name: "", genre: "" }
            doRelease(connection);
            res.render("html/film", { user: req.session.username, movieData: ret });
        }
    });
});

app.get("/despre", function(req, res) {
    res.render("html/despre", {user: req.session.username});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {user: req.session.username});
});

app.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});