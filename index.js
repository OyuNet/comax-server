const express = require("express")
const userdata = require("./data.json")
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/auth", function(req, res) {
    const username = req.query.username;
    const password = req.query.password;

    userdata.map((x) => {
        if (x["username"] === username && x["password"] === password) {
            res.header('Access-Control-Allow-Origin', "*");
            res.sendStatus(200);
        }
    })

    return res.sendStatus(404);
}) 

app.listen(8000)