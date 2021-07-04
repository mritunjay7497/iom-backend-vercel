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

// owner schema
const ownerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: 5,
        maxlength:100
    },
    email:{
        type:String,
        required:true,
        minlength:10,
        maxlength:255
    },
    phone:{
       type:String,
       required:true,
       minlength:10,
       maxlength:10 
    },
    password:{
        type:String,
        required:true,
        minlength:10,
        maxlength:1024
    },
    isOwner: Boolean
});

ownerSchema.methods.getAuthToken = function () {
    const token = jwt.sign({
        _id: this.id,
        name: this.name,
        email: this.email,
        phone:this.phone,
        isOwner: this.isOwner,
    },secret);

    return token;
}

// get model from owner schema
const OwnerModel = new mongoose.model('owner',ownerSchema);

// register a new owner to IOM database
async function addOwner(username,useremail,userpassword,userphone){

    let error_msg = '';

    // search for the email, if already registered
    const isRegiatered = await OwnerModel.findOne({email:useremail})

    // if available, throw error
    if(isRegiatered){
        error_msg = "Owner already registered, try logging in instead."
    };

    // hash the password before writing it to database
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(userpassword,salt);

    const owner = new OwnerModel({
        name: username,
        email: useremail,
        phone: userphone,
        password: hashedPassword,
        isOwner: true
    });
    // save owner model
    await owner.save();

    // generate JWT auth token
    const token = owner.getAuthToken();

    // send appropriate response to user
    if(!error_msg){

        const response = _.pick(owner,['name','email','phone']);
        
        // return data
        return({ response,token });
    }
    else{

        const response = error_msg;

        // return data
        return({ response,token });
    }

    
};

// get owner profile
async function getOwner(id){
    const owner = await OwnerModel.findById(id).select('-password');
    return owner;
};

module.exports = { addOwner,getOwner,OwnerModel };