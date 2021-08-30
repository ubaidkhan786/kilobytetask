const mongoose = require("mongoose");
const model = mongoose.Schema({
    itemName:{
        type: String,
        required:true
    },
    CategoryName:{
        type: String,
        required: true
    },
    Addresses: {
        type: Array,
        required: true
    },
});

module.exports = new mongoose.model("Catalogue",model)