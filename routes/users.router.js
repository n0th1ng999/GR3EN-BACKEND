const express = require('express')
const router = express.Router()
const {getUser,register,login,getUsers}=require('../Server/controllers/users.controller')
const {auth_user,auth_admin,auth_same_user} = require('../Server/controllers/auth.controller') // Authentication Middleware 
const {editUser,deleteUser,titles,badges} = require('../Server/controllers/users.controller.js')
const User = require('../Server/models/user.model')


router.route('/')
    .get(auth_admin,getUsers)
    .post(register)

router.route('/login')
    .get(login)

router.route('/:userid')
    .put(auth_same_user,editUser)
    .delete(auth_admin,deleteUser)
    .get(auth_same_user,getUser)
   
router.route('/:userid/titles')
    .post(auth_user,titles)

router.route('/:userid/badges')
    .post(auth_user,badges)


module.exports = router