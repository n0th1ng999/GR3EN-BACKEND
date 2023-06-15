const express = require('express')
const {auth_user,auth_admin,auth_coordinator_activity,auth_verifier} = require('../controllers/auth.controller') // Authentication Middleware 
const router = express.Router()
const { getActivities, createActivity, addUserToActivity, editActivity, deleteActivity,removeUserFromActivity, changeUserState, changeActivityState, enroll, unEnroll } = require('./../controllers/activities.controller') 

router.route('/')
    .get(getActivities)
    .post(auth_admin,createActivity)

router.route('/:activityid')
/* .put(auth_user,editActivity)
.put(auth_coordinator_activity,changeActivityState) */
.put(auth_coordinator_activity,editActivity)
.delete(auth_admin,deleteActivity)

router.route('/:activityid/change-activity-state')
.patch(auth_coordinator_activity,changeActivityState)

router.route('/:activityid/enroll')
    .post(auth_user,enroll)
    .delete(auth_user,unEnroll)

router.route('/:activityid/users/:userid')
    .post(auth_user,addUserToActivity)
    .delete(auth_user,removeUserFromActivity)

router.route('/:activityid/users/:userid/change-user-state')
    .patch(auth_coordinator_activity,changeUserState)
   

module.exports = router
