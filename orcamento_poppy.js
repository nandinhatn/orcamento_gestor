require('dotenv').config();
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
app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

app.post('/api/login', (req,res,next)=>{
    let sqlQuery = `SELECT * FROM login WHERE login = '${req.body.login}'`
    let query = conn.query(sqlQuery, (err, results)=>{
        if(err){
            console.log(err)
        
           res.send({auth:false});
            
        };
        console.log(results)
        if( results &&results.length>0){
            login = results[0].login
            password= results[0].password
        }

        if( req && req.body.login==login && req.body.password==password){
            const id = 1;
            const token = jwt.sign({id}, process.env.SECRET,{
                expiresIn:50
            });
            return res.send({auth:true, token:token, results: results})
        }
        res.json({auth:false})
    })
})

function verifyJWT(req,res,next){
    const token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({auth: false, message:" no token provider"});

    jwt.verify(token, process.env.SECRET, function(err,decoded){
        if(err) return res.status(500).json({auth:false, message:'falied to authenticate token'});
        req.userId = decoded.id;
        console.log('aqui', req.userId)
        next();
    })
}
app.get('/api/clients', verifyJWT, (req,res)=>{
    let sqlQuery = "SELECT * FROM clients";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) return res.send(apiResponse({auth:false}));
        res.send(apiResponse(results))
    })
})

 app.get('/api/clients/:id', verifyJWT, (req,res)=>{
    let sqlQuery = "SELECT * FROM clients WHERE id_clients='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
}) 
app.post('/api/clients', verifyJWT, (req,res)=>{
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

app.put('/api/clients/:id', verifyJWT,(req,res)=>{
    let sqlQuery = "UPDATE clients SET client_name='"+req.body.client_name+"', cnpj='"+req.body.cnpj+"', address='"+req.body.address+"', email='"+req.body.email+"' WHERE id_clients='"+req.params.id+"'"
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
    res.send(apiResponse(results)) 
   })
})
app.delete('/api/clients/:id', verifyJWT, (req,res)=>{
    let sqlQuery = "DELETE FROM clients WHERE id_clients='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.post('/api/orcamento', verifyJWT, (req,res)=>{
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
        dispute: req.body.dispute,
        date_evento: req.body.date_evento,
        win: req.body.win


    }
    let query = conn.query(sqlQuery, data, (err, results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.get('/api/orcamento', verifyJWT, (req,res)=>{
    let sqlQuery = "SELECT * FROM budget";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err){
            console.log('aqui')
            res.send({auth:false})
        } 
        res.send(apiResponse(results))
    })
})

app.get('/api/orcamento/:id', verifyJWT, (req,res)=>{
    let sqlQuery = "SELECT * FROM budget WHERE id_job='"+req.params.id+"'";
    let query = conn.query(sqlQuery, (err,results)=>{
        if(err) throw err;
        res.send(apiResponse(results))
    })
})

app.put('/api/orcamento/:id', verifyJWT,(req,res)=>{
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

app.delete('/api/orcamento/:id', verifyJWT, (req,res)=>{
    let sqlQuery= "DELETE FROM budget WHERE id_job='"+req.params.id+"'";
    let query = conn.query(sqlQuery,(err,results)=>{
        if (err) throw err;
        res.send(apiResponse(results))
    })
})

httpServer.listen(8000, ()=>{
    console.log('server initiadted succesfully')
})