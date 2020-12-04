const jwt = require("jsonwebtoken")

module.exports.verifyToken = async(req,res,next)=>{
    const token = req.header('Authorization') 
    if(token === undefined || token === '')
    {
        return res.status(401).json({error:"access denied"})
    }

    try {
        const { user } = await  jwt.verify(token, process.env.token_secret)
        if(!user) return res.status(422).send("wrong token")
        req.info = user
        next()
    } catch (error) {
        console.log(error);
        res.status(400).send("invalid token")
    }
}

