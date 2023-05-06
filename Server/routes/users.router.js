const express = require('express')
const router = express.Router()
const {getUsers,register,login} =require('../controllers/users.controller')
const {auth_user,auth_admin} = require('../controllers/auth.controller') // Authentication Middleware 
const {newUser,editUser,deleteUser,titles,badges} = require('../controllers/users.controller.js')
const User = require('../models/user.model')


router.route('/')
    .post(register)
    .get(auth_user,getUsers)
        
router.route('/login').get(login)

router.route('/:userid')
    .put(auth_user,editUser)
    .delete(auth_user,deleteUser)





module.exports = router