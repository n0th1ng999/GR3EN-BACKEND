const Badge = require('../models/badge.model')
const User = require('../models/user.model')

module.exports={

    createBadge: async (req,res) => {
        Badge.create(req.body)
        .then((badge) => {res.status(201).send(badge)})
        .catch(err => {res.status(400).send({err:err.message})})
    }
}