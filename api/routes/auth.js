const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const rounds = 10

const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

const middleware = require('../middleware')



router.post('/login', (req, res) => {
    User.findOne({
        phoneNumber: req.body.phoneNumber
    }).then(user => {
        if (!user) res.status(404).json({ error: 'no user with that phoneNumber found' })
        else {
            bcrypt.compare(req.body.password, user.password, (error, match) => {
                if (error) res.status(500).json(error)
                else if (match) res.status(200).json({ token: generateToken(user) })
                else res.status(403).json({ error: 'passwords do not match' })
            })
        }
    });
})


router.post('/signup', (req, res) => {
   console.log(req.body)
   console.log({rounds})
    bcrypt.hash( req.body.password, rounds,(error, hash) => {
        if (error) {
            res.status(500).json(error)
            console.log(error)
        }
        else {
            const newUser = User({
                phoneNumber: req.body.phoneNumber,
                password: hash,
                userType: req.body.userType,
            })
            newUser.save().then(user => {
                res.status(200).json(user)
            })
                .catch(error => {
                    console.log(error)
                    res.status(500).json(error)
                })
        }
    })
});

router.get('/jwt-test', middleware.verify, (req, res) => {
    res.status(200).json(req.user)
})


function generateToken(user) {
    return jwt.sign({
        data: user
    }, tokenSecret, {
        expiresIn: '24h'
    })
}

module.exports = router;