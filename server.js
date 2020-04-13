const express = require("express"),      
      app     = express(),
      fetch   = require("node-fetch");

const API_KEY = "03d842cc1cbc4535bf140ca81c4578ac";

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index");
})

app.listen(process.env.PORT, () => console.log("SERVER UP"));