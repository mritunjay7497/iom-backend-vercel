const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authorize = require('../middleware/auth');
const _ = require('lodash');



// get restaurant models
const {addRestaurant,getRestaurant,updateRestaurant,deleteRestaurant,restaurantDetailsModel} = require('../models/restaurant');

// load local environment configuration file
dotenv.config();

const secret = process.env.secret;

const restaurantRoute = express.Router();

// create application/json parser
const jsonParser = bodyParser.json();



// Add a new restaurant
restaurantRoute.post('/', authorize, jsonParser ,async (req,res) => {

    // get auth token from request header
    const token = req.header('x-auth-token');

    // get payload from token
    const payload = jwt.verify(token,secret);

    // get owner email address
    const ownerEmail = payload.email;

    let data = {email:ownerEmail, name:req.body.name, location:req.body.location, manager:req.body.manager};

    const restaurant = addRestaurant(data)

        .then((resData) => res.send(resData))
        .catch((err) => console.log(err));
});



// update a restaurant
restaurantRoute.put('/',authorize,jsonParser,(req,res) => {

    // get auth token from request header
    const token = req.header('x-auth-token');

    // get payload from token
    const payload = jwt.verify(token,secret);

    // get owner email address
    const ownerEmail = payload.email;
    const routeData = { name:req.body.name,location:req.body.location,manager:req.body.manager,
                        newName:req.body.newName,newLocation:req.body.newLocation,newManager:req.body.newManager
                    }
    const restaurant = updateRestaurant(routeData)
        .then((data) => res.send(_.pick(data,['name','location','manager'])))
        .catch((err) => console.log(err));
});


// delete a restaurant
restaurantRoute.delete('/',authorize,jsonParser,(req,res) => {

    // get auth token from request header
    const token = req.header('x-auth-token');

    // get payload from token
    const payload = jwt.verify(token,secret);

    // get owner email address
    const ownerEmail = payload.email;

    const restaurant = deleteRestaurant(ownerEmail)
        .then((data) => res.send(data))
        .catch((err) => console.log(err));
    
});

// get all the restaurant for an owner
restaurantRoute.get('/',authorize,jsonParser,(req,res) => {
    // get auth token from request header
    const token = req.header('x-auth-token');

    // get payload from token
    const payload = jwt.verify(token,secret);

    // get owner email address
    const ownerEmail = payload.email;

    const restaurant = getRestaurant(ownerEmail)
        .then((data) => res.send(data))
        .catch((err) => console.log(err));
});

module.exports = restaurantRoute;