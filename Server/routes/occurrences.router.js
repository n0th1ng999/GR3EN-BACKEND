const express = require('express')
const router = express.Router()
const {auth_user,auth_admin} = require('../controllers/auth.controller')
const {getOccurrences,addOccurrence,editOccurrence,deleteOccurrence} = require('../controllers/occurrences.controller')

router.route('/')
    .get(auth_admin,getOccurrences)
    .post(auth_user,addOccurrence)        
    

router.route('/:occurrenceid')
    .put(auth_admin,editOccurrence)
    .delete(auth_admin,deleteOccurrence)


module.exports = router
