const express = require("express")
const fs = require("fs")
const app = express()
const axios = require("axios")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get("/auth", function(req, res) {
    const userdata = require("./data.json")

    const username = req.query.username;
    const password = req.query.password;

    let isOk = false

    userdata.map((x) => {
        if (x["username"] === username && x["password"] === password) {
            res.header('Access-Control-Allow-Origin', "*")
            const obj = {
                status: "ok"
            }
            res.header("Access-Control-Allow-Origin", "*");
            res.json(obj)

            isOk = true;
        }
    })

    if (isOk) {
        // belki sonra bir şeyler yapılır.
    } else {
        const obj = {
            status: "error"
        }
        res.header('Access-Control-Allow-Origin', "*")
        res.json(obj)
    }
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
            res.header("Access-Control-Allow-Origin", "*");
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
                res.header("Access-Control-Allow-Origin", "*");
                res.json(obj)
            }
        })
    } 
})

app.get("/isStaff", async function(req, res) {
    const data = require("./data.json")
    const username = req.query.username

    let status = false;

    data.map((x) => {
        if (username === x["username"]) {
            if (x["type"] === "admin") {
                status = true;
            }
        }
    })

    if (status) {
        const obj = {
            status: "ok"
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json(obj)
    } else {
        const obj = {
            status: "error"
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json(obj)
    }

})

app.get("/tickets", async function(req, res) {
    const ticketData = require('./tickets.json')
    const username = req.query.username
    const password = req.query.password

    let userTickets = [];

    const response = await axios.get("http://localhost:8000/auth", { params: { username: username, password: password }})
    const data = response.data;

    if (data["status"] === "ok") {
        ticketData.map((x) => {
            if (x["user"] === username) {
                userTickets.push(x);
            }
        })
    
        const obj = {
            status: "ok",
            content: userTickets
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json(obj)
    } else {
        const obj = {
            status: "error"
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.json(obj)
    }
})

app.get("/tickets/add", async function(req, res) {
    const username = req.query.username
    const password = req.query.password
    const title = req.query.title
    const desc = req.query.desc

    const response = await axios.get("http://localhost:8000/auth", { params: { username: username, password: password }})
    const data = response.data;

    if (data["status"] === "ok") {
        const newTicket = {
            user: username,
            title: title,
            desc: desc
        }

        let tickets = require("./tickets.json")
        tickets.push(newTicket)

        fs.writeFileSync("./data.json", JSON.stringify(tickets, null, 2), (err) => {
            if (err) {
                res.header("Access-Control-Allow-Origin", "*");
                console.error("Data write error.")
                const obj = {
                    status: "error"
                }
                res.json(obj)
            } else {
                res.header("Access-Control-Allow-Origin", "*");
                const obj = {
                    status: "ok"
                }
                res.json(obj)

            }
        })

    } else {
        res.header("Access-Control-Allow-Origin", "*");
        console.error("Data write error.")
        const obj = {
            status: "error"
        }
        res.json(obj)
    }
})

app.listen(8000)

console.log("Listening port 8000.")