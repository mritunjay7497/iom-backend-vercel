const mongoose = require('mongoose');
const dotenv = require('dotenv');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// loads the local .env file into process.env
dotenv.config();

// connecting to the mongoDB
const dburi = process.env.dbURI;
const secret = process.env.secret;

mongoose.connect(dburi, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false } )
    .then(() => console.log('connected to IOM database...'))
    .catch((err) => console.log("ERROR : \n",err));


// Hotel/Restaurant schema
const hotelSchama = new mongoose.Schema({
    
})
