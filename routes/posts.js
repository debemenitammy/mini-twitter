const express = require("express");
const router =express.Router();
const Post = require('../models/Post');
const User =require('../models/User');
const webtoken = require("../middware/auth");
const {Validator}= require('node-input-validator');
const jwt=require('jsonwebtoken');
//GETS ALL THE TWEETS

router.get('/', webtoken.verifyToken,async(req,res) =>{
    try {
        const posts= await Post.find();
        res.json(posts)
    }
    catch(err){
        res.json({message:err});
    }
});
// //POSTING A TWEET
// router.post('/',webtoken.verifyToken,async(req,res) =>{
//     try {

//         const users= await User.findOne({mail: req.info.mail});
//         res.json(req.info)
//     }
//     catch(err){
//         res.json({message:err});
//     }
// });

//making a tweet

router.post('/', webtoken.verifyToken,async(req,res) =>{
 try { 
    const users= await User.findOne({_id: req.info._id})
    const  v =  new Validator(req.body, {
        title: "required|minLength:0|maxLength:20",
        content: "required|minLength:0|maxLength:300",
        user_id: users._id         
    })
    user_id: users._id 

    console.log(users._id);

    // const match = await v.check()
    // if(!match) return res.status(422).json({error: v.errors})
    const post = new Post(req.body);
     await post.save()
    //  res.send("You just tweeted")
     
     await jwt.sign({post}, process.env.token_secret, {expiresIn: 60*60*24}, (err,token) =>
    {
        if(err) return res.status(500).send("something went wrong")
        return res.status(201).json({message:  `${users.firstName} just tweeted at ${Date.now()}`, post, token})
    });
    //  console.log(post);
    //  res.send(post)

 } catch (error) {
     console.log(error);
     res.status(500).send("something went wrong")

 }
}); 

//All TWEETs of specific user

router.get('/specific', async(req,res) =>{
    try {

        const users= await Post.findOne({user_id: req.info._id});
        res.json(users)
    }
    catch(err){
        res.json({message:err});
    }
});
// DELETE All POSTS
router.delete("/", webtoken.verifyToken,async(req,res)=>{
    try {
   const deletedPost= await Post.remove({user_id: req.info._id})
   res.status(201).send("Posts Deleted Successfully");

}
catch(err){
    res.json({message:err});
}
});

// UPDATE A POST

router.patch('/', webtoken.verifyToken,async(req,res)=>{
    try {
   const updatedPost= await Post.updateOne({user_id: req.info._id},{$set: {content:req.body.content}})
   res.status(201).send("Post Updated Successfully");
}
catch(err){
    res.json({message:err});
}
});





module.exports=router; 