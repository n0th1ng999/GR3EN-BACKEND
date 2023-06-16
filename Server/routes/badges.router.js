const express = require('express')
const router = express.Router()
const {auth_user,auth_admin,auth_same_user} = require('../controllers/auth.controller') // Authentication Middleware 
const {giveBadgeList,createBadge,getBadges,deleteBadge,getBadge,editBadge} = require('../controllers/badges.controller.js')

module.exports = router

router.route('/')
    .get(getBadges)
    .post(auth_admin,createBadge)

router.route('/:badgeid')
    .get(getBadge)
    .put(auth_admin,editBadge)
    .delete(auth_admin,deleteBadge)