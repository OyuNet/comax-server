const express = require("express")
const fs = require("fs")
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/auth", function(req, res) {
    const userdata = require("./data.json")

    const username = req.query.username;
    const password = req.query.password;

    userdata.map((x) => {
        if (x["username"] === username && x["password"] === password) {
            res.header('Access-Control-Allow-Origin', "*")
            const obj = {
                status: "ok"
            }
            res.json(obj)
        }
    })

    const obj = {
        status: "error"
    }
    res.header('Access-Control-Allow-Origin', "*")
    res.json(obj)
})

app.get("/register", function(req, res) {
    const userdata = require("./data.json")

    const username = req.query.username;
    const password = req.query.password;

    let err;

    userdata.map((x) => {
        if (x["username"] === username) {
            res.header("Access-Control-Allow-Origin", "*");
            const obj = {
                status: "error"
            }
            res.json(obj)
            err = true;
        }
    })

    if (err) {
        return;
    } else {
        const acc = {
            username: username,
            password: password,
            type: "user"
        }
    
        let newUserdata = userdata;
        newUserdata.push(acc);
    
        fs.writeFileSync("./data.json", JSON.stringify(newUserdata, null, 2), (err) => {
            if (err) {
                console.error("Data write error.")
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                const obj = {
                    status: "ok"
                }
                res.json(obj)
            }
        })
    } 

})

app.listen(8000)

console.log("Listening port 8000.")