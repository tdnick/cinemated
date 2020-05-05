const http = require("http");
const port = process.env.PORT || 5000;
const fs = require("fs");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("html/index", {});
});

app.get("/index", function (req, res) {
    res.render("html/index", {});
});

app.get("/filme", function(req, res) {
    res.render("html/filme", {});
});

app.get("/bilete", function(req, res) {
    res.render("html/bilete", {});
});

app.get("/limitless", function(req, res) {
    res.render("html/limitless", {});
});

app.listen(8080, function(error) {
    if (error) {
        console.log("Something went wrong!", error);
    }
    else {
        console.log("Server is on port " + port);
    }
});
