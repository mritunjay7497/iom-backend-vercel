const express = require('express');
const home = require('./router/home');
const owner = require('./router/owner');
const signin = require('./router/ownerLogin');
const restaurant = require('./router/restaurant');
const cors = require('cors');


const app = express();


// Route handler middleware
app.use('/home',home);
app.use('/api/register',owner);
app.use('/login',signin);
app.use('/restaurant',restaurant);
app.use(cors);



// get port number from environment variable
const PORT = process.env.PORT || 1234

// start the server
app.listen(PORT,() => {
    console.log(`server started on http://localhost:${PORT}`);
});