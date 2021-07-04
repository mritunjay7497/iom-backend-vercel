const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const Joi = require('joi');
const authorize = require('../middleware/auth');
const { addOwner,getOwner } = require('../models/owner');

const ownerRoute = express.Router();

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

// Route to register a new user

ownerRoute.post('/',jsonParser,(req,res) => {
    // const { error } = validateOwner(req.body);

    // if(error){
    //     return res.status(400).send(error.details[0].message)
    // };

    // add a new user to database upon post request

    const owner = addOwner(req.body.name,req.body.email,req.body.password,req.body.phone)
        .then((data) => res.header('x-auth-token',data.token).send(data.response))
        .catch((err) => console.log(err));
});


ownerRoute.get('/me',authorize, (req,res) => {

    // Return owner object from databse
    const owner = getOwner(req.owner._id)
        .then((usr) => res.send(_.pick(usr,['name','email','phone','isOwner'])))
        .catch((err) => console.log(err));
});



// // validate user input

// function validateOwner(owner){
//     const schema = {
//         name: Joi.string().required().min(4).max(50),
//         email: Joi.string().required().min(5).max(50).email(),
//         password: Joi.string().required().min(8).max(255),
//         phone: Joi.string().required().min(10).max(10)
//     };
//     const isvalid = schema.validate(owner);
//     return isvalid;
// };

// export module

module.exports = ownerRoute;