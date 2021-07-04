const express = require('express');
const ownerAuth = require('../models/ownerLogin');
const bodyParser = require('body-parser');

const loginRoute = express.Router();

// create application/json parser
const jsonParser = bodyParser.json();

// Route to authenticate owner

loginRoute.post('/',jsonParser,(req,res) => {

    // match credentials from DB
    const validCreds = ownerAuth(req.body.email,req.body.password)
        .then((data) => res.header('x-auth-token',data.token).send("Log-in successful."))
        .catch((err) => res.send(err));

    // console.log(req.body)

});

module.exports = loginRoute;