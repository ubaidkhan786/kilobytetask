const mongoose = require("mongoose");
const model = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    customerPhone:{
        type: Number,
        required:true
    },
    item:{
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    deliveryLocation : {
        type: String,
        required:true
    },
    deliveryPersonPhone:{
        type: Number,
        required: false,
    },
    orderStatus: {
        type: String,
        required: true,
    }
});

module.exports = new mongoose.model("Order",model)