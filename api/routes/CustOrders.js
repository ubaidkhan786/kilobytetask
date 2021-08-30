const express = require("express");
const router = express.Router()
const User = require('../models/user')
const Catalogue = require('../models/catalogue')
const Order = require('../models/order')

const bcrypt = require('bcrypt')
const rounds = 10

const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

const middleware = require('../middleware')


const order = require("../models/order");
router.post('/placeOrder', async (req, res) => {
    // this can be done only by customers

    /// user will pass item, quantity 
    // create an entry in orders table and pick one random location for that item from the DB
    const ordId = makeid(10);
    const item = req.body.itemName
    let cat = await Catalogue.findOne({ itemName: item })
    const addressses = cat.Addresses;
    const index = Math.floor((Math.random() * (addressses.length - 1)) + 1);
    console.log({ index })
    const newOrder = Order({
        orderId: ordId,
        customerPhone: req.body.customerPhone,
        item: req.body.itemName,
        quantity: Number(req.body.quantity),
        orderStatus: 'Task Created',
        deliveryLocation: addressses[index],
    })
    newOrder.save().then(ord => {
        res.status(200).json(ord)
    })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}



router.post('/assignDeliveryPersonToOrder', async (req, res) => {
    // This can be done only by admin

    // admin will pass deliveryPerson Id (phone no) and one order Id
    // assign delivery person to that order Id
    const orderId = req.body.orderId;
    const deliveryPersonPhone = req.body.deliveryPersonPhone;
    const stat = await Order.updateOne({ orderId: orderId }, { deliveryPersonPhone: deliveryPersonPhone });

    res.status(200).json(stat)
})

router.post('/orders', async (req, res) => {
    // this can be done only by admin to fetch all orders
    const orderStatus = req.body.orderStatus ?? null;

    // this will return all the orders where orderSTatus == (passed in req.body)
    const orders = await Order.findOne({ orderStatus: orderStatus })
    return res.status(200).json(orders)


})
router.post('/orders/getAll', async (req, res) => {
    // this can be done only by admin to fetch all orders
    const orderStatus = req.body.orderStatus ?? null;


    // this will return all the orders where orderSTatus == (passed in req.body)
    const orders = await Order.find()
    return res.status(200).json(orders)




})

router.get('orderStatusPossible', (req, res) => {
    // this can be fetched by admin and delivery person only

    const orderStatusPossible = ['Task Created', 'Reached Store', 'Items Picked', 'Enroute', 'Delivered', 'Canceled'];
    // returns the list of possbile order statues
    return res.status(200).json(orderStatusPossible)
})

router.post('/changeOrderStatus', async (req, res) => {
    // this can be done only by delivery Person and admin

    const orderId = req.body.orderId;
    const newStatus = req.body.newStatus;

    // change the order status for the given order ID
    await Order.updateOne({ orderId: orderId }, { orderStatus: newStatus });
    res.status(200).json("done")


});

router.get('/deliveryPersons', middleware.verify, (req, res) => {
    // this can be fetched only by admin users


    // return the list of all delivery pesons

    // return the users where type == delivery Person
    if (req.user.userType !== 'Admin') {
        return res.status(400).json("not allowed")
    }

    User.find({
        userType: 'deliveryPerson'
    }).then(users => {
        if (!users) res.status(404).json({ error: 'no delivery persons found' })
        else {
            res.status(200).json(users);
        }
    });
})


module.exports = router;