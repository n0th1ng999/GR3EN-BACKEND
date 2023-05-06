const express = require('express')
const router = express.Router()
const {auth_user,auth_admin} = require('../controllers/auth.controller') // Authentication Middleware 
const {createRanking,getRankings} = require('../controllers/ranking.controller')

router.route('/')
.post(createRanking)
.get(getRankings)

module.exports = router