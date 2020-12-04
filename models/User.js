const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName:
    {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    // post_id:{
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Post',
    //     required: true
    // }
});


module.exports = mongoose.model("User", UserSchema)


