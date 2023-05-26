const express = require('express')
const router = express.Router()
const {auth_user,auth_admin} = require('../controllers/auth.controller')
const {giveBadgeList,createBadge} = require('../controllers/badges.controller.js')

module.exports = router

router.route('/')
    .put(giveBadgeList,auth_user)
    .post(auth_admin,createBadge)

router.route('/:badgeid')
    .put(auth_admin)
    .delete(auth_admin)