const mongoose = require("mongoose")
const model = mongoose.Schema({
    phoneNumber:{
        type: Number,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    userType: {
        type:String,
        required:true
    }
});

module.exports = new mongoose.model("User",model)