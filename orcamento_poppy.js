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

function apiResponse(results){
    return JSON.stringify({
        "status": 200,
        "error":null,
        "response": results
    })
}

app.get('/api/clients', (req,res)=>{
    let sqlQuery = "SELECT * FROM clients";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

 app.get('/api/clients/:id', (req,res)=>{
    let sqlQuery = "SELECT * FROM clients WHERE id_clients='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
}) 
app.post('/api/clients', (req,res)=>{
    let data ={
        client_name: req.body.client_name,
        cnpj: req.body.cnpj,
        address: req.body.address,
        email: req.body.email
        

    }
    let sqlQuery = "INSERT INTO clients SET ?"
    let query = conn.query(sqlQuery, data,(err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.put('/api/clients/:id', (req,res)=>{
    let sqlQuery = "UPDATE clients SET client_name='"+req.body.client_name+"', cnpj='"+req.body.cnpj+"', address='"+req.body.address+"', email='"+req.body.email+"' WHERE id_clients='"+req.params.id+"'"
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
    res.send(apiResponse(results)) 
   })
})
app.delete('/api/clients/:id', (req,res)=>{
    let sqlQuery = "DELETE FROM clients WHERE id_clients='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.post('/api/orcamento', (req,res)=>{
    let sqlQuery = "INSERT INTO budget SET ?";
    let data ={
        description: req.body.description,
        integral_value : req.body.integral_value,
        sucess_value: req.body.sucess_value,
        min_value: req.body.min_value,
        colaborators: req.body.colaborators,
        entry_date: req.body.entry_date,
        delivery_date: req.body.delivery_date,
        approved: req.body.approved,
        client_id: req.body.client_id,
        date_payment: req.body.date_payment,
        project_name: req.body.project_name,
        dispute: req.body.dispute


    }
    let query = conn.query(sqlQuery, data, (err, results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.get('/api/orcamento', (req,res)=>{
    let sqlQuery = "SELECT * FROM budget";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.get('/api/orcamento/:id', (req,res)=>{
    let sqlQuery = "SELECT * FROM budget WHERE id_job='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.put('/api/orcamento/:id', (req,res)=>{
    let data ={
        description: req.body.description,
        integral_value : req.body.integral_value,
        sucess_value: req.body.sucess_value,
        min_value: req.body.min_value,
        colaborators: req.body.colaborators,
        entry_date: req.body.entry_date,
        delivery_date: req.body.delivery_date,
        approved: req.body.approved,
        client_id: req.body.client_id,
        date_payment: req.body.date_payment,
        project_name: req.body.project_name,
        dispute: req.body.dispute


    }
    let sqlQuery = "UPDATE budget SET description='"+req.body.description+"', integral_value='"+req.body.integral_value+"', sucess_value='"+req.body.sucess_value+"', min_value='"+req.body.min_value+"', colaborators='"+req.body.colaborators+"', entry_date='"+req.body.entry_date+"', delivery_date='"+req.body.delivery_date+"', approved='"+req.body.approved+"', client_id='"+req.body.client_id+"', date_payment='"+req.body.date_payment+"', project_name='"+req.body.project_name+"', dispute='"+req.body.dispute+"' WHERE id_job='"+req.params.id+"'";
    let query = conn.query(sqlQuery,(err,results)=>{
        if (err) throw (err)
        res.send(apiResponse(results))
    })
    
})

app.delete('/api/orcamento/:id', (req,res)=>{
    let sqlQuery= "DELETE FROM budget WHERE id_job='"+req.params.id+"'";
    let query = conn.query(sqlQuery,(err,results)=>{
        if (err) throw err;
        res.send(apiResponse(results))
    })
})

httpServer.listen(8000, ()=>{
    console.log('server initiadted succesfully')
})