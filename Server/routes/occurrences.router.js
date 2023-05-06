const express = require('express')
const router = express.Router()
const {auth_user,auth_admin} = require('../controllers/auth.controller')
const {getOccurrences,addOccurrence,editOccurrence,deleteOccurrence} = require('../controllers/occurrences.controller')

router.route('/')
    .get(getOccurrences)
    .post(addOccurrence)        
    

router.route('/:occurrenceid')
    .put(editOccurrence)
    .delete(deleteOccurrence)


module.exports = router
