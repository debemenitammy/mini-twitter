const express = require('express');
const app = express();
const mongoose= require('mongoose');
const nodemon =require('nodemon');
const bodyParser= require('body-parser');
require ('dotenv/config');



//Import routes

// Routes
const usersRoute= require("./routes/users");
const postsRoute= require("./routes/posts");

app.use(bodyParser.json());
app.use('/users',usersRoute);
app.use('/posts',postsRoute);

//connect to db

mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true , useUnifiedTopology: true}, 
()=>{console.log("connected to DB")
})

app.listen(3000);

