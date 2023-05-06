const express = require('express')
const {auth_user,auth_admin} = require('../controllers/auth.controller') // Authentication Middleware 
const router = express.Router()
const { getActivities, createActivity, addUserToActivity, editActivity, deleteActivity,removeUserFromActivity, changeUserState } = require('./../controllers/activities.controller') 

router.route('/')
    .get(auth_admin,getActivities)
    .post(auth_admin, createActivity)

router.route('/:activityid')
    .put(auth_user,editActivity)
    .delete(auth_admin,deleteActivity)

router.route('/:activityid/users/:userid')
    .post(auth_user,addUserToActivity)
    .delete(auth_user,removeUserFromActivity)

router.route('/:activityid/users/:userid/change-user-state')
    .post(auth_admin,changeUserState)
   

module.exports = router
