const http = require("http");
var bodyParser = require('body-parser');
var oracledb = require('oracledb');
const port = process.env.PORT || 5000;
const fs = require("fs");
const express = require("express");
const app = express();

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));

app.get("/", function (req, res) {
    res.render("html/index", {});
});

app.get("/index", function (req, res) {
    res.render("html/index", {});
});

app.get("/filme", function(req, res) {
    res.render("html/filme", {});
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

app.get("/bilete", function(req, res) {
    res.render("html/bilete", {});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {});
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