const express = require("express");
const router =express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

const jwt=require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Validator}= require('node-input-validator');
const saltRounds = 10
const webtoken = require("../middware/auth")

//GETS Specific
router.get('/specific',webtoken.verifyToken, async(req,res) =>{
    try {

        const users= await User.findOne({mail: req.info.mail});
        res.json(req.info)
    }
    catch(err){
        res.json({message:err});
    }
});

router.get('/', webtoken.verifyToken,async(req,res) =>{
    try {
        const users= await User.find();
        res.json(users)
    }
    catch(err){
        res.json({message:err});
    }
});


//SIGN UP

router.post('/',async(req,res) =>{
 try { 

    const  v =  new Validator(req.body, {
        firstName: "required|minLength:2",
        lastName: "required|minLength:2",
        age: "required",
        password: "required",
        mail: "required|email",
    })
    
    const match = await v.check()
    if(!match) return res.status(422).json({error: v.errors})

    const emailExist = await User.findOne({mail: req.body.mail});
    if (emailExist) return res.status(400).send("Email Already exists");

    const hash = bcrypt.hashSync(req.body.password, saltRounds)
    //object destructuring
    const {age, lastName} = req.body
    if(Number(age) < 18) return res.status(422).send("mad man you are too young")
    if(lastName === "Abeeb" || lastName === "abeeb") return res.status(422).send("Abeeb please get out")
    let namee = "sadiq"
    req.body.password = hash
    console.log(hash == req.body.password);
    const user= new User(req.body);
     await user.save()
    // res.send("nawa")
    await jwt.sign({user}, process.env.token_secret, {expiresIn: 60*60*24}, (err,token) =>
    {
        if(err) return res.status(500).send("something went wrong")

    });

 } catch (error) {
     console.log(error);
     res.status(500).send("something went wrong")
 }
}); 

//login
router.post('/login', async(req, res)=>{
    const user = await User.findOne({mail: req.body.mail})

    if (!user) return res.status(400).send("A User with such email doesn't exist");
    const matchPassword = await bcrypt.compare(req.body.password, user.password)
    console.log(user.password)
    console.log(matchPassword);
    if(!matchPassword) return res.status(422).send("invalid details")
    
    await jwt.sign({user}, process.env.token_secret, {expiresIn: 60*60*24}, (err,token) =>
    {
        if(err) return res.status(500).send("something went wrong")
        return res.status(201).json({message: "user logged in", user, token})
    });
})
//SPECIFIC USER

router.get('/',async(req,res) =>{
    

    try {
        const user= await User.findById({_id: req.info._id});
        res.json(user);
    }
    catch(err){
        res.json({message:err});
    }
});
// DELETE A USER
router.delete('/',webtoken.verifyToken,async(req,res)=>{
    try {
   const deletedPosts= await Post.deleteMany({user_id: req.info._id})
   const deletedUser= await User.deleteOne({_id: req.info._id})
   
    res.status(201).send(deletedPosts);}
 catch(err){
     res.json({message:err});
 }
   


});

// UPDATE A USER

router.patch('/',webtoken.verifyToken,async(req,res)=>{
    try {
   const updatedUser= await User.updateOne({_id: req.info._id},{$set: {firstName:req.body.firstName}})
   res.json(updatedUser);
}
catch(err){
    res.json({message:err});
}
});





module.exports=router; 
