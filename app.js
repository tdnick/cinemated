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


app.get("/last", function(req, res) {
    res.render("html/last", {});
});

app.get("/", function (req, res) {
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
        }
        console.log("After connection");
        connection.execute("SELECT * FROM filme ORDER BY film_id", {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    response.status(500).send("Error getting data from DB");
                    doRelease(connection);
                    return;
                }
           
                var movies = [];
                result.rows.forEach(function (element) {
                    movies.push({
                        id: element.FILM_ID,
                        name: element.NUME_FILM,
                        poster: element.LINK_AFIS,
                        desc: element.DESCRIERE,
						year: element.AN_APARITIE
                    });
                }, this);
                doRelease(connection);
                console.log("Got movies data");
				
				function getRndInteger(min, max) {
					return Math.floor(Math.random() * (max - min + 1) ) + min;
				}
				
				randomMovie = movies[getRndInteger(0, movies.length - 2)];
				lstMovie = movies[movies.length - 1];
				
                res.render("html/index", { user: req.session.userData, randMovie: randomMovie, lastMovie: lstMovie });
            });
    });
});

app.get("/login", function (req, res) {
    res.render("html/login", {});
});

app.get('/dashboard', function (req, res) {
    res.redirect("/dashboard/info");
})

app.get("/dashboard/info", function (req, res) {
    res.render("html/dashboard/info", {user: req.session.userData});
})

app.get('/dashboard/security', function (req, res) {
    res.render("html/dashboard/security", {user: req.session.userData});
})

app.get('/dashboard/tickets', function (req, res) {
    if (req.session.userData){
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }

            var dbRequest = "SELECT user_id, rezervare_id, bilet_id, tip_bilet, nume_film, data, ora, sala, rand, nr_loc FROM bilete JOIN ecranizari USING(ecranizare_id) JOIN filme USING(film_id) where user_id = " + req.session.userData.id + " order by rezervare_id";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                        doRelease(connection);
                        return;
                    }
    				
    				tickets = []
                    result.rows.forEach(function (element) {
                        tickets.push({
                            resCode: element.REZERVARE_ID,
                            code: element.BILET_ID,
                            type: element.TIP_BILET,
                            name: element.NUME_FILM,
                            date: element.DATA,
                            time: element.ORA,
                            room: element.SALA,
                            row: element.RAND,
                            seat: element.NR_LOC
                        });
                    }, this);
                    doRelease(connection);
                    console.log("Got all ticket data");
                    res.render("html/dashboard/tickets", { user: req.session.userData, ticketData: tickets});
                });
        });
    } else {
        res.render("html/dashboard/tickets", { user: req.session.userData });
    }
})

app.get('/dashboard/settings', function (req, res) {
    res.render("html/dashboard/settings", {user: req.session.userData});
})

app.get('/dashboard/users', function (req, res) {
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }

        var dbRequest = "SELECT * FROM users order by user_id";
        connection.execute(dbRequest, {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).send("Error");
                    doRelease(connection);
                    return;
                }
				
				users = []
                result.rows.forEach(function (element) {
                    users.push({
                        id: element.USER_ID,
                        username: element.USERNAME,
                        name: element.FULL_NAME,
                        email: element.EMAIL,
                        isAdmin: element.IS_ADMIN,
                    });
                }, this);
                doRelease(connection);
                console.log("Got all user data");
				console.log(req.session.userData);
                res.render("html/dashboard/users", { user: req.session.userData, usersData: users});
            });
    });
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
	    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            response.status(500).send("Error connecting to DB");
            return;
        }
        console.log("After connection");
        connection.execute("SELECT * FROM filme ORDER BY film_id", {},
            { outFormat: oracledb.OBJECT },
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    response.status(500).send("Error getting data from DB");
                    doRelease(connection);
                    return;
                }
           
                var movies = [];
                result.rows.forEach(function (element) {
                    movies.push({
                        id: element.FILM_ID,
                        name: element.NUME_FILM,
                        poster: element.LINK_AFIS,
                        desc: element.DESCRIERE,
						year: element.AN_APARITIE
                    });
                }, this);
                doRelease(connection);
                console.log("Got movies data");
				
				function getRndInteger(min, max) {
					return Math.floor(Math.random() * (max - min + 1) ) + min;
				}
				
				randomMovie = movies[getRndInteger(0, movies.length - 2)];
				lstMovie = movies[movies.length - 1];
				
                res.render("html/index", { user: req.session.userData, randMovie: randomMovie, lastMovie: lstMovie });
            });
    });
    
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
        connection.execute("SELECT * FROM filme ORDER BY film_id", {},
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
            var dbRequest = "SELECT * FROM filme LEFT JOIN ecranizari USING(film_id) WHERE film_id = '" + id + "'";
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                        doRelease(connection);
                        return;
                    }
					
					movies = []
					screenings = []
                    result.rows.forEach(function (element) {
                        movies.push({
                            id: element.FILM_ID,
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
                        });
						screenings.push({
							ecrID: element.ECRANIZARE_ID,
							data: element.DATA,
							ora: element.ORA,
							sala: element.SALA,
						});
                    }, this);
                    doRelease(connection);
                    console.log("Got movie data");
					ret = movies[0];
                    console.log(ret);
					console.log("Got screening data");
					console.log(screenings);
					console.log(req.session.userData);
                    res.render("html/film", { user: req.session.userData, movieData: ret, screenData: screenings });
                });
        } else {
            var ret = { name: "", genre: "" }
            doRelease(connection);
            res.render("html/film", { user: req.session.userData, movieData: ret });
        }
    });
});
app.get("/choose", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
	console.log("Got screening id");
	console.log(id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }
        if (id) {
            var dbRequest = "SELECT * FROM ecranizari JOIN filme USING(film_id) WHERE ecranizare_id  = '" + id + "'";
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
                            name: element.NUME_FILM
                        };
                    }, this);
                    doRelease(connection);
                    console.log("Got movie data");
                    console.log(ret);				
                    res.render("html/choose", { user: req.session.userData, movieData: ret});
                });
        } else {
            var ret = { name: "", genre: "" }
            doRelease(connection);
            res.render("html/choose", { user: req.session.userData, movieData: ret });
        }
    });
});
app.get("/locuri", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
	
    const id = search_params.get('id');
	console.log("Got screening id here");
	console.log(id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }
        if (id) {
				ret=[];
				screening=[];
				rows=[];
				var dbRequestSec = "SELECT nume_film, data, ora, sala, nr_loc, rand FROM ecranizari JOIN filme USING(film_id) JOIN bilete USING(ecranizare_id) WHERE ecranizare_id = '" + id + "'";
				 connection.execute(dbRequestSec, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Error");
                        doRelease(connection);
                        return;
                    }
                    result.rows.forEach(function (element) {
                        rows.push({
                            place: element.NR_LOC,
							row: element.RAND
					});
					ret.push({
                            name: element.NUME_FILM                  
                        });
						screening.push = ({							
							data: element.DATA,
							ora: element.ORA,
							sala: element.SALA
						});
					
                    }, this);
                    doRelease(connection);
                    console.log("Got rows");
                    console.log(rows);               
					res.render("html/locuri", { selectedSeats: rows, user: req.session.userData, movieData: ret, screen: screening });					
                });
        }
		else{
			doRelease(connection);
		}
    });
});
app.get("/confirm", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
	console.log("Got screening id");
	console.log(id);
    oracledb.getConnection(connectionProperties, function (err, connection) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error connecting to DB");
            return;
        }
        if (id) {
            var dbRequest = "SELECT * FROM ecranizari JOIN filme USING(film_id) WHERE ecranizare_id  = '" + id + "'";
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
                            name: element.NUME_FILM                  
                        };
						screening = {		
							ecrID: element.ECRANIZARE_ID,
							data: element.DATA,
							ora: element.ORA,
							sala: element.SALA
						};
                    }, this);
                    doRelease(connection);
                    console.log("Got movie data");
                    console.log(ret);
					console.log("Got screening data");
					console.log(screening);
                    res.render("html/confirm", { user: req.session.userData, movieData: ret, screen: screening });
                });
				
        } else {
            var ret = { name: "", genre: "" }
            doRelease(connection);
            res.render("html/confirm", { user: req.session.userData, movieData: ret });
        }
    });
});
app.get("/despre", function(req, res) {
    res.render("html/despre", {user: req.session.userData});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {user: req.session.userData,
                                  limitless: req.session.limitlessData});
    console.log(req.session.limitlessData)
    console.log(req.session.userData)
});

app.get("/delete", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
    if (req.session.userData){
        if (req.session.userData.isAdmin){
            oracledb.getConnection(connectionProperties, function (err, connection) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error connecting to DB");
                    return;
                }
                if (id) {
                    var dbRequest = "DELETE FROM filme WHERE film_id = '" + id + "'";
                    connection.execute(dbRequest, {},
                        { outFormat: oracledb.OBJECT },
                        function (err, result) {
                            if (err) {
                                console.error(err);
                                res.status(500).send("Error on delete");
                                doRelease(connection);
                                return;
                            }
                            doRelease(connection);
                            if (result.rowsAffected == 0){
                                console.log("Tried to delete a movie which doesn't exist!");
                            } else {
                                console.log("Movie id " + id + " deleted successfully");
                            }
                            res.redirect("/filme");
                        });
                } else {
                    res.status(500).send("No movie was given for deletion!");
                }
            });
        } else {
            res.status(500).send("Operation forbidden! Not logged in as administrator!");
        }
    } else {
        res.status(500).send("Operation forbidden! Not logged in!");
    }
})

app.get("/toggleAdmin", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
    const code = search_params.get('code');
    if (req.session.userData){
        if (req.session.userData.isAdmin){
            if (code == "0" || code == "1"){
                oracledb.getConnection(connectionProperties, function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error connecting to DB");
                        return;
                    }
                    if (id) {
                        var dbRequest = "UPDATE users SET is_admin = " + code + " WHERE user_id = '" + id + "'";
                        connection.execute(dbRequest, {},
                            { outFormat: oracledb.OBJECT },
                            function (err, result) {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send("Error on toggling admin");
                                    doRelease(connection);
                                    return;
                                }
                                doRelease(connection);
                                if (result.rowsAffected == 0){
                                    console.log("Tried to edit a user which doesn't exist!");
                                } else {
                                    console.log("Account id " + id + " toggle admin success");
                                }
                                res.redirect("dashboard/users");
                            });
                    } else {
                        res.status(500).send("No account was given for toggling admin!");
                    }
                });
            } else {
                res.status(500).send("Wrong admin toggle code!");
            }
        } else {
            res.status(500).send("Operation forbidden! Not logged in as admin!");
        }
    } else {
        res.status(500).send("Operation forbidden! Not logged in!");
    }
})

app.get("/deleteuser", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
    if (req.session.userData){
        if (req.session.userData.id == id || req.session.userData.isAdmin){
            oracledb.getConnection(connectionProperties, function (err, connection) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error connecting to DB");
                    return;
                }
                if (id) {
                    var dbRequest = "DELETE FROM users WHERE user_id = '" + id + "'";
                    connection.execute(dbRequest, {},
                        { outFormat: oracledb.OBJECT },
                        function (err, result) {
                            if (err) {
                                console.error(err);
                                res.status(500).send("Error on delete");
                                doRelease(connection);
                                return;
                            }
                            doRelease(connection);
                            if (result.rowsAffected == 0){
                                console.log("Tried to delete a user which doesn't exist!");
                            } else {
                                console.log("Account id " + id + " deleted successfully");
                            }
                            if (!req.session.userData.isAdmin){
                                req.session.destroy();
                                res.status(500).send('Account deleted successfully. Sorry to see you go! <a href="index">Home</a>');
                            } else {
                                res.redirect("dashboard/users");
                            }
                        });
                } else {
                    res.status(500).send("No account was given for deletion!");
                }
            });
        } else {
            res.status(500).send("Operation forbidden! Not your account!");
        }
    } else {
        res.status(500).send("Operation forbidden! Not logged in!");
    }
})

app.get("/deleteticket", function (req, res) {
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;

    const id = search_params.get('id');
    const user = search_params.get('user');
    if (req.session.userData){
        
        if (req.session.userData.id == user){
            oracledb.getConnection(connectionProperties, function (err, connection) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error connecting to DB");
                    return;
                }
                if (id) {
                    var dbRequest = "DELETE FROM bilete WHERE bilet_id = '" + id + "'";
                    connection.execute(dbRequest, {},
                        { outFormat: oracledb.OBJECT },
                        function (err, result) {
                            if (err) {
                                console.error(err);
                                res.status(500).send("Error on deleting ticket");
                                doRelease(connection);
                                return;
                            }
                            doRelease(connection);
                            if (result.rowsAffected == 0){
                                console.log("Tried to delete a ticket which doesn't exist!");
                            } else {
                                console.log("Ticket id " + id + " deleted successfully ");
                            }
                            res.redirect("dashboard/tickets");
                        });
                } else {
                    res.status(500).send("No ticket was given for deletion!");
                }
            });
        } else {
            res.status(500).send("Operation forbidden! Not your ticket!");
        }
        
    } else {
        res.status(500).send("Operation forbidden! Not logged in!");
    }
})

// POST requests
app.post("/confirm", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0; // not a problem
	var crypto = require("crypto");
	var rezervare_id = crypto.randomBytes(7).toString('hex');
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
			
			var types=fields.nrBilete.split(',');
		
			var s_types=['elevi','adulti','copii','studenti']
			var i=0;
			
            var seats = fields.nrLoc.split(",");
			console.log(seats);
			
            for (let seat of seats) {		
            while(types[i]<0 && i<4){				
				i += 1;
			}
			
			rp=seat.split(" ");
			row=rp[0];
			place=rp[1];
			console.log(fields.idClient);
			console.log(fields.idEcr);
            var dbRequest = "INSERT INTO bilete (bilet_id,rezervare_id, nr_loc,tip_bilet,user_id,ecranizare_id,rand) VALUES (1+(SELECT COUNT(*) FROM bilete), '" + rezervare_id + "', '" + place + "', '" + s_types[i] + "', '" + fields.idClient + "', '" + fields.idEcr + "', '" + row + "')";
            types[i] += -1;
			connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err);
                      
                        return;
                    }
                    doRelease(connection);
                    console.log("bilet adaugat");
                    
            });
			
			}
        });
		 ret = {
                nr: rezervare_id                
                };
		 res.render('html/last', {rezervare: ret, user: req.session.userData});
    });
});
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
            var dbRequest = "INSERT INTO users (username, email, password, full_name, is_admin) VALUES ('" + fields.username + "', '" + fields.email + "', '" + encrPass + "', '" + fields.fname + "', 0)";
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
                    
                var dbRequest = "UPDATE users SET password = '" + newPassword + "' WHERE (username = '" + req.session.userData.username + "' AND password = '" + oldPassword + "')";
                
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
            var dbRequest = "UPDATE users SET full_name = '" + fields.fname + "', email = '" + fields.email + "' WHERE username = '" + req.session.userData.username + "'";
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
                        ret = {id: element.USER_ID, username: element.USERNAME, name: element.FULL_NAME, email: element.EMAIL, userId: element.USER_ID, isAdmin: element.IS_ADMIN};
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
                    // doRelease(connection);
                    if (control == 1){
                        req.session.userData = ret;
                        console.log("User logged in");                       
                    } else {
                        res.render("html/login", {cntl: control});
                    }
                    //console.log(req.session.userData)

            });
            //console.log(req.session.userData)

            dbRequest = "SELECT l.limitless_id, l.user_id, l.last_name, l.first_name, l.email, l.type, l.phone_number, l.start_date, l.end_date " +
            "FROM users u JOIN limitless l ON (u.user_id = l.user_id) WHERE l.limitless_id = (SELECT MAX(limitless_id) FROM limitless WHERE user_id IN " +
            "(SELECT user_id FROM users WHERE username = '" + fields.username + "'))";
            
            console.log(dbRequest)
            connection.execute(dbRequest, {},
                { outFormat: oracledb.OBJECT },
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error getting data from DB - limitless");
                        doRelease(connection);
                        return;
                    }
                    var ret;
                    result.rows.forEach(function (element) {
                        ret = {lastName: element.LAST_NAME, firstName: element.FIRST_NAME, startDate: element.START_DATE, endDate: element.END_DATE};
                    }, this);
                    req.session.limitlessData = ret;
                    doRelease(connection); 

                    if (control == 1){
                        console.log("User logged in");                       
                        res.redirect('/index');
                    } else {
                        res.render("html/login", {cntl: control});
                    }

            });
            // console.log(req.session.limitlessData)
            // console.log(req.session.userData)

            
        });
    });
    console.log(req.session.limitlessData)
    console.log(req.session.userData)
});

app.post('/dashboard/settings', function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0;
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            var dbRequest = "UPDATE users SET username = '" + fields.username + "' WHERE username = '" + req.session.userData.username + "'";
            console.log("username activ: " + req.session.userData.username);
            connection.execute(dbRequest, {}, {outFormat: oracledb.OBJECT}, function (err, result) {
                if (err) {
                    console.error(err);
                    if (err.message.localeCompare("ORA-00001: unique constraint (VERONICACHIRUT.USERS_UK2) violated") == 0){
                        control = 1; //username already taken
                    }
                    res.render('html/dashboard/settings', {cntl: control, user: req.session.userData});
                    doRelease(connection);
                    return;
                }
                doRelease(connection);
                req.session.userData.username = fields.username;
                console.log("Username updated successfully");
                if (control == 0){
                    res.render('html/dashboard/settings', {cntl: control, user: req.session.userData});
                }
            })
        })
    })
})

app.post("/filme", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0;
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            var dbRequest = 
            "INSERT INTO filme (film_id, nume_film, gen_film, regizori, actori, link_trailer, link_afis, descriere, durata, limba_originala, an_aparitie)" + 
            " VALUES (1 + (SELECT count(film_id) FROM filme), '" + fields.title + "', '" + fields.genre + "', '" + fields.director + "', '" + 
            fields.actor + "', '" + fields.trailer + "', '" + fields.poster + "', '" + fields.desc +  
            "', " + fields.time + ", '" + fields.lang + "', " + fields.year + ")";
            console.log(dbRequest)
            connection.execute(dbRequest, {}, 
                {outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.redirect('filme');
                        doRelease(connection);
                        return;
                    }

                    doRelease(connection);
                    console.log("Movie successfully added!");
                    res.redirect('filme');
                });
        });
    });
})

app.post("/limitless", function (req, res) {
    var form = new formidable.IncomingForm();
    var control = 0;
    form.parse(req, function (err, fields, files) {
        oracledb.getConnection(connectionProperties, function (err, connection) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Error connecting to DB");
                return;
            }
            
            // console.log(fields.lastName)
            // console.log(fields.firstName)
            // console.log(fields.email)
            // console.log(fields.phoneNumber)
            // console.log(fields.typeOfCard)
            // console.log(fields.userId)
            // console.log(fields.startDate)
            // console.log(fields.endDate)
            var dbRequest = 
            "INSERT INTO limitless (limitless_id, user_id, last_name, first_name, email, type, phone_number, start_date, end_date)" + 
            "VALUES(1 + (SELECT MAX(limitless_id) FROM limitless), " + fields.userId + ", '" + fields.lastName + "', '" + fields.firstName + "', '" + 
            fields.email + "', '" + fields.typeOfCard + "', '" + fields.phoneNumber + "', TO_DATE('" + fields.startDate +  
            "', 'dd-mm-yyyy'), TO_DATE('" + fields.endDate + "', 'dd-mm-yyyy'))";
            console.log(dbRequest)
            connection.execute(dbRequest, {}, 
                {outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        res.render('html/limitless', {});
                        doRelease(connection);
                        return;
                    }

                    doRelease(connection);
                    console.log("Card limitless successfully created!");
                    req.session.limitlessData = {lastName: fields.lastName, firstName: fields.firstName, startDate: fields.startDate, endDate: fields.endDate}
                    res.redirect('filme');
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