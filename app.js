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

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({
    secret: 'abcdefg', // for login
    resave: true,
    saveUninitialized: false
}));

// database configuration

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

// GET requests

app.get("/choose", function(req, res) {
    res.render("html/choose", {});
});

app.get("/confirm", function(req, res) {
    res.render("html/confirm", {});
});

app.get("/locuri", function(req, res) {
    res.render("html/locuri", {});
});

app.get("/last", function(req, res) {
    res.render("html/last", {});
});

app.get("/", function (req, res) {
    res.render("html/index", {user: req.session.userData});
});

app.get("/login", function (req, res) {
    res.render("html/login", {});
});

app.get("/dashboard/info", function (req, res) {
    res.render("html/dashboard/info", {user: req.session.userData});
})

app.get('/dashboard', function (req, res) {
    res.redirect("/dashboard/info");
})

app.get('/dashboard/security', function (req, res) {
    res.render("html/dashboard/security", {user: req.session.userData});
})

app.get('/dashboard/limitless', function (req, res) {
    res.render("html/dashboard/limitless", {user: req.session.userData});
})

app.get('/dashboard/tickets', function (req, res) {
    res.render("html/dashboard/tickets", {user: req.session.userData});
})

app.get('/dashboard/settings', function (req, res) {
    res.render("html/dashboard/settings", {user: req.session.userData});
})

app.get("/register", function (req, res) {
    res.render("html/register", {});
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    console.log("User logged out");
    res.render('html/logout');
});

app.get("/index", function (req, res) {
    res.render("html/index", {user: req.session.userData});
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
				 // Perfect :)
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
                res.render("html/filme", { user: req.session.userData, moviesData: movies });
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
                    res.render("html/film", { user: req.session.userData, movieData: ret });
                });
        } else {
            var ret = { name: "", genre: "" }
            doRelease(connection);
            res.render("html/film", { user: req.session.userData, movieData: ret });
        }
    });
});

app.get("/despre", function(req, res) {
    res.render("html/despre", {user: req.session.userData});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {user: req.session.userData});
});

// POST requests

app.post("/register", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0; // not a problem
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
                            control = 1; // username already used
                        } else if (err.message.localeCompare("ORA-00001: unique constraint (VERONICACHIRUT.USERS_UK1) violated") == 0){
                            control = 2; // email address already used
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

app.post("/dashboard/security", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = -1; //unknown error
    
    form.parse(req, function (err, fields, files) {
        
        var cipher1 = crypto.createCipher('aes-128-cbc', 'mypassword');
        var oldPassword = cipher1.update(fields.oldpass, 'utf8', 'hex');
        oldPassword += cipher1.final('hex');
        
        if (fields.newpass != fields.repeat) {
            control = 1; // passwords do not match
            res.render('html/dashboard/security', {cntl: control, user: req.session.userData});
        } else {
            oracledb.getConnection(connectionProperties, function (err, connection) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error connecting to DB");
                    return;
                }
                
                var cipher2 = crypto.createCipher('aes-128-cbc', 'mypassword');
                var newPassword = cipher2.update(fields.newpass, 'utf8', 'hex');
                newPassword += cipher2.final('hex');
                    
                var dbRequest = "update users set password = '" + newPassword + "' where (username = '" + req.session.userData.username + "' and password = '" + oldPassword + "')";
                
                connection.execute(dbRequest, {}, {outFormat: oracledb.OBJECT}, function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        return;
                    }
                    console.log(result.rowsAffected);
                    if (result.rowsAffected == 0){
                        control = 2; //old password was entered wrong
                    } else if (result.rowsAffected == 1){
                        console.log("Password updated successfully");
                        control = 0;
                    }
                    doRelease(connection);
                    res.render('html/dashboard/security', {cntl: control, user: req.session.userData});
                });
            });
        }
    });
});

app.post('/dashboard/info', function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0;
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            var dbRequest = "update users set full_name = '" + fields.fname + "', email = '" + fields.email + "' where username = '" + req.session.userData.username + "'";
            console.log("username activ: " + req.session.userData.username);
            connection.execute(dbRequest, {}, {outFormat: oracledb.OBJECT}, function (err, result) {
                if (err) {
                    console.error(err);
                    if (err.message.localeCompare("ORA-00001: unique constraint (VERONICACHIRUT.USERS_UK1) violated") == 0){
                        control = 1; //email address already used
                    }
                    res.render('html/dashboard/info', {cntl: control, user: req.session.userData});
                    doRelease(connection);
                    return;
                }
                doRelease(connection);
                req.session.userData.name = fields.fname;
                req.session.userData.email = fields.email;
                console.log("User data updated successfully");
                if (control == 0){
                    res.render('html/dashboard/info', {cntl: control, user: req.session.userData});
                }
            })
        })
    })
})

app.post('/login', function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0; // default code for general authentication error
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
                        control = 3; // username was not found in the database
                    }
                    result.rows.forEach(function (element) {
                        ret = {username: element.USERNAME, name: element.FULL_NAME, email: element.EMAIL};
                        if (element.PASSWORD == encrPass){
                            //aici trebuie neaparat cu litere mari pt ca altfel nu face verificarea cum trb, imi pare rau de coding style :))
                            // e okay, nu sunt un coding style nazi :))))
                            // ms pwp apreciez
							// cu placere ;)
                            control = 1; // valid login data
                        }
                        else {
                            console.log("User tried to log in with wrong password");
                            control = 2; // the user exists but the password is wrong
                        }
                    }, this);
                    doRelease(connection);
                    if (control == 1){
                        req.session.userData = ret;
                        console.log("User logged in");
                        res.redirect('/index');
                    } else {
                        res.render("html/login", {cntl: control});
                    }
            });
        });
    });
});

app.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});