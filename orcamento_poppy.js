const jwt = require("jsonwebtoken");
const express = require("express")
const bodyParser= require("body-parser");
const mysql = require ("mysql")
const path = require("path");
const fs = require("fs");
const http = require('http');
const https = require('https')
const cors = require('cors')
const credential = require('./credentials/credentials.js');
const app = express();
const httpServer = http.createServer(app)
app.use(bodyParser.json());

app.use(cors({origin:'*'}));
app.use(express.static("./images"))
app.use(bodyParser.urlencoded({extended:true}))

const conn = mysql.createConnection(
    credential

)

conn.connect((err)=>{
    if(err) throw err;
    console.log("mysql connect with app")
})

httpServer.listen(8000, ()=>{
    console.log('server initiadted succesfully')
})