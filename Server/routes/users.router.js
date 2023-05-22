const express = require('express')
const router = express.Router()
const {getUser,register,login}=require('../controllers/users.controller')
const {auth_user,auth_admin} = require('../controllers/auth.controller') // Authentication Middleware 
const {editUser,deleteUser,titles,badges} = require('../controllers/users.controller.js')
const User = require('../models/user.model')


router.route('/')
    .post(register)
        
router.route('/login')
    .get(login)

router.route('/:userid')
    .put(auth_user,editUser)
    .delete(auth_user,deleteUser)
    .get(getUser)
   
router.route('/:userid/titles')
    .post(auth_user,titles)

router.route('/:userid/badges')
    .post(auth_user,badges)


module.exports = router