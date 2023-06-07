const express = require('express')
const { createTitle, getTitles, editTitle, deleteTitle } = require('../controllers/titles.controller')
const router = express.Router()
const {auth_user,auth_admin} = require('../controllers/auth.controller')

router.route('/')
    .get(getTitles)
    .post(auth_admin, createTitle)

    router.route('/:id')
    .put(auth_admin,editTitle)
    .delete(auth_admin,deleteTitle)
    
module.exports = router