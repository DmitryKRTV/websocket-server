import {Request, Response} from "express";
import express = require("express");

const app = express()
const port = process.env.PORT || 5000

app.get("/", (req: Request, res: Response) => {
    let helloMessage = "hello incubator!!";
    res.send(helloMessage)
})

const startApp = async () => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp();