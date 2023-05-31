const User = require('../models/user.model')
const Activity = require('../models/activity.model')
const {createToken,decodeToken,verifyToken} = require('./Helpers/jwtHelpers')

module.exports={
    auth_user: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
            res.status(401)
            res.send({error:"Client is not authenticated"}) 
        }else{
            const bearer = header.split(' ')
            if(verifyToken(bearer[1])){
                //console.log('Token Válido')
                res.locals.userId = decodeToken(bearer[1]).id 
                next()
            }
        }
       
        
    },auth_same_user: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
            res.status(401)
            res.send({error:"Client is not authenticated"}) 
        }else{
        const bearer = header.split(' ')
        if(verifyToken(bearer[1])){
            const userId = decodeToken(bearer[1]).id 
            console.log(userId)
        if(userId == req.params.userid){
            next()
        }else{
            res.status(403).send({error: 'provided auth_key is not matching with user auth_key'})
        }
        }
        }
    },
    auth_admin: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
            res.status(401)
            res.send({error:"Client is not authenticated"}) 
        }else{
        const bearer = header.split(' ')
        if(verifyToken(bearer[1])){
            const userId = decodeToken(bearer[1]).id
            
            User.findById(userId).then(user => { 
                if(user.conselhoEco){
        
                    res.locals.userId = userId
                    next()
                }else{
                    res.status(403).send({error:"This client is forbidden in this route"})
                }
            }).catch(err =>  res.status(404).send({error:err.message}))
        }
        }

    },
    auth_verifier: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
            res.status(401)
            res.send({error:"Client is not authenticated"}) 
        }else{
        const bearer = header.split(' ')
        if(verifyToken(bearer[1])){
            //console.log('Válido')
            try {
                const userId = decodeToken(bearer[1]).id
            } catch (error) {
                res.status(400).send({error:"Invalid JWT token"})
            }
            
            User.findById(userId).then(user => { 
                if(user.verifierEco){
                    //console.log('Verifier!')
                    res.locals.userId = userId
                    next()
                }else{
                    res.status(403).send({error:"This client is forbidden in this route"})
                }
            })
        }
        }
    },
    auth_coordinator_activity: async (req,res,next) => {
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
            res.status(401)
            res.send({error:"Client is not authenticated"}) 
        }else{
        const bearer = header.split(' ')
        if(verifyToken(bearer[1])){
            const userId = decodeToken(bearer[1]).id
            let activity
            try{
                
                activity = await Activity.findById(req.params.activityid).exec()
                
            }catch(err){
                
                res.status(404).send({error:'wrong activity id'})
                
            }
            if(activity?.coordenadorAtividade == userId){
                res.locals.userId = userId
                next()
            }else{
                //console.log(activity.coordenadorAtividade)
                //console.log(userId)
                res.status(403).send({message: 'Client is not coordinator of activity'})
            }

        }
    }
}
}