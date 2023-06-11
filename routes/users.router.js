const express = require('express')
const router = express.Router()
const {getUser,register,login,getUsers, deleteProfile,editProfile,getProfile}=require('../controllers/users.controller')
const {auth_user,auth_admin,auth_same_user} = require('../controllers/auth.controller') // Authentication Middleware 
const {editUser,deleteUser,titles,badges} = require('../controllers/users.controller.js')
const User = require('../models/user.model')


router.route('/')
    .get(getUsers)
    .post(register)

router.route('/login')
    .post(login)

router.route('/user-profile')
    .put(auth_user, editProfile)
    .delete(auth_user, deleteProfile)
    .get(auth_user, getProfile)

router.route('/:userid')
    .put(auth_admin,editUser)
    .delete(auth_admin,deleteUser)
    .get(auth_admin,getUser)
   
router.route('/:userid/titles')
    .post(auth_user,titles)

router.route('/:userid/badges')
    .post(auth_user,badges)


module.exports = router