const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OwnerModel } = require('../models/owner');


//  loads the local .env file into process.env
dotenv.config();

// connecting to the mongoDB
const dburi = process.env.dbURI;
const secret = process.env.jwtSecret;

mongoose.connect(dburi, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false } )
    .then(() => console.log('connected to IOM database...'))
    .catch((err) => console.log(err));


async function ownerAuth(email,password) {
    // check if owner is registered
    const owner = await OwnerModel.findOne({email: email});
    if(!owner){
        return "Invalid Email or Password."
    };

    // compare plain-text password with the hashed password.
    const validPassword = await bcrypt.compare(password,owner.password);

    if(!validPassword){
        return "Invalid Email or Password."
    };

    const token = owner.getAuthToken();
    return {token};

};

module.exports = ownerAuth;