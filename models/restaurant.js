const mongoose = require('mongoose');
const dotenv = require('dotenv');
const _ = require('lodash');

// loads the local .env file into process.env
dotenv.config();

// connecting to the mongoDB
const dburi = process.env.dbURI;
const secret = process.env.secret;

mongoose.connect(dburi, { useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("connected to IOM DB"))
    .catch((err) => console.log(err));



// restaurant details schema
const restaurantDetailsSchema = new mongoose.Schema({
    
    // restaurantData: [
    //     {
    //         name: {
    //             required: true,
    //             type: String
    //         },
    //         location: {
    //             required:true,
    //             type: String
    //         }
    //     }
    // ],   
    name:{
        required: true,
        type: String
    },
    location:{
        required: true,
        type: String
    },
    manager:{
        required: true,
        type: String
    }
});


// restaurant owner schema
const restaurantOwnerSchema = new mongoose.Schema({
   
    ownerEmail: {
        type:String,
        required: true,
    },
    
        restaurantDetails: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RestaurantDetails'
            }
        ]
        
    
});



// restaurant details model
const restaurantDetailModel = new mongoose.model('RestaurantDetails',restaurantDetailsSchema);

// console.log(restaurantDetailModel)

// restaurant owner model
const restaurantOwnerModel = new mongoose.model('RestaurantOwner',restaurantOwnerSchema);



// ADD a restaurant
async function addRestaurant(routeData){

    // check whether the owner has already registered a restaurant or not
    let isPresent = await restaurantOwnerModel.find({ownerEmail:routeData.email})

    // if Yes, update that document
    if(isPresent.length>0){

        // update the existing document
        return "Owner document already exists.\nTry updating instead."
        
    }

    // if No, add another document
    else{

        const restaurant = new restaurantDetailModel({
            
            name: routeData.name,
            location: routeData.location,
            manager: routeData.manager

        });
    
        await restaurant.save()    

        if(routeData.email){
        const restaurantOwner = new restaurantOwnerModel({
            ownerEmail: routeData.email,
            restaurantDetails: restaurant
        });
        await restaurantOwner.save()
        
        return(restaurantOwner);
        };

    }
   

};

// GET all restaurants
async function getRestaurant(email){

    // get owner profile
    const ownerProfile = await restaurantOwnerModel.find({ownerEmail:email})

    // get restaurant id array
    const restaurantID = ownerProfile[0].restaurantDetails;

    const restaurantList = await restaurantDetailModel
        .find({_id:restaurantID[0]})
    
    return restaurantList;
    
};


// UPDATE a restaurant
async function updateRestaurant(routeData) {

    // check for owner email updation
    // if(routeData.newEmail === ""){
    //     newEmail = oldEmail
    // }

    // const restaurant_details = ;

    query = {name:routeData.name,location:routeData.location,manager:routeData.manager}

    const restaurant = await restaurantDetailModel
        .findOneAndUpdate(

            query,
            {
                name: routeData.newName,
                location: routeData.newLocation,
                manager: routeData.newManager
            },
            {new:true}
    )
    await restaurant.save()
    return(restaurant);
};


// DELETE a restaurant
async function deleteRestaurant(email){

    // get owner profile
    const ownerProfile = await restaurantOwnerModel.find({ownerEmail:email})

    // get restaurant id array
    const restaurantID = ownerProfile[0].restaurantDetails;
    console.log(restaurantID[0]);

    const restaurant = await restaurantDetailModel
        .deleteOne({ _id:restaurantID[0] });
    
    return "Restaurant data deleted"
};


module.exports = {getRestaurant,addRestaurant,updateRestaurant,deleteRestaurant}
