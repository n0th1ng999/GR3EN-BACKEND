const express = require('express')
const router = express.Router()
const {auth_user,auth_admin, auth_verifier} = require('../controllers/auth.controller')
const {getOccurrences,addOccurrence,editOccurrence,deleteOccurrence} = require('../controllers/occurrences.controller')

router.route('/')
    .get(auth_verifier,getOccurrences)
    .post(auth_user,addOccurrence)        
    

router.route('/:occurrenceid')
    .put(auth_verifier,editOccurrence)
    .delete(auth_verifier,deleteOccurrence)

module.exports = router
