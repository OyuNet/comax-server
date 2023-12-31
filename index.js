const express = require("express")
const fs = require("fs")
const app = express()
const axios = require("axios")

function resOk(res) {
    const obj = {
        status: "ok"
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(obj)
}

function resErr(res) {
    const obj = {
        status: "error"
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.json(obj)
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

async function queryStaff(username, password, isStaff) {
    const res = await axios.get("http://localhost:8000/isStaff", { params: { username: username, password: password }})
    const data = res.data;

    isStaff = data["status"] === "ok" ? true : false
}

app.get("/auth", function(req, res) {
    const userdata = require("./data.json")

    const username = req.query.username;
    const password = req.query.password;

    let isOk = false

    userdata.map((x) => {
        if (x["username"] === username && x["password"] === password) {
            resOk(res)

            isOk = true;
        }
    })

    if (isOk) {
        // belki sonra bir şeyler yapılır.
    } else {
        resErr(res)
    }
})

app.get("/register", function(req, res) {
    const userdata = require("./data.json")

    const username = req.query.username;
    const password = req.query.password;

    let err;

    userdata.map((x) => {
        if (x["username"] === username) {
            resErr(res)
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
                resOk(res)
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
        resOk(res)
    } else {
        resErr(res)
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
    
        resOk(res)
    } else {
        resErr(res)
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
                console.error("Data write error.")
                resErr(res)
            } else {
                resOk(res)

            }
        })

    } else {
        console.error("Data write error.")
        resErr(res)
    }
})

app.get("/tickets/remove", function(req, res) {
    const username = req.query.username
    const password = req.query.password
    const ticketTitle = req.query.title
    let isStaff;
    const ticketData = require("./tickets.json")

    if (isStaff) {

        let indexNum = 0;
        let toRemovedNums = [];

        ticketData.map((x) => {
            if (x["title"] == ticketTitle && x["user"] == username) {
                toRemovedNums.push(indexNum)
            }
            indexNum++;
        })

        let newTicketData = [];
        let indexNum2 = 0;

        ticketData.map((x) => {
            toRemovedNums.map((y) => {
                if (y == indexNum2) {

                } else {
                    newTicketData.push(x)
                }
            })

            indexNum2++;
        })

        fs.writeFileSync("./tickets.json", JSON.stringify(newTicketData, null, 2), (err) => {
            if (err) {
                console.error("Data write error.")
                resErr(res)
            } else {
                resOk(res)
            }
        })

    } else {
        resErr(res)
    }

})

app.get("/projects/add", function(req, res) {
    const projectName = req.query.projectName;
    const projectDesc = req.query.projectDesc;
    const projectImg = req.query.projectImg;

    let projectsData = require("./projects.json");

    if (projectDesc != null || projectName != null || projectImg != null) {
        resErr(res)
    } else {
        const dataObj = {
            projectName: projectName,
            projectDesc: projectDesc,
            projectImg: projectImg
        }
        projectsData.push(dataObj);

        fs.writeFileSync("./projects.json", JSON.stringify(dataObj, null, 2), (err) => {
            if (err) {
                console.error(err)
                resErr(res)
            } else {
                resOk(res)
            }
        })
    }
})

app.listen(8000)

console.log("Listening port 8000.")