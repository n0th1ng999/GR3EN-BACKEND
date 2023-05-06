const User = require('../models/user.model')
const {createToken,decodeToken,verifyToken} = require('./Helpers/jwtHelpers')

module.exports={
    auth_user: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
        console.log('nao ha header') // trocar
        }


        if(verifyToken(req.cookies.jwt)){
            //console.log('Token Válido')
            next()
        }else{
            res.status(401)
            res.send("Client is not authenticated") 
        }
    },auth_same_user: async (req,res,next)=>{
        if(verifyToken(req.cookies.jwt)){
            const userId = decodeToken(req.cookies.jwt).id 
        if(userId == req.params.userid){
            next()
        }else{
            res.status(403).send({error: 'provided auth_key is not matching with user auth_key'})
        }
        }else{
            res.status(401)
            res.send("Client is not authenticated") 
        }
    },
    auth_admin: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
        console.log('nao ha header') // trocar
        }

        if(verifyToken(req.cookies.jwt)){
            //console.log('Válido')

            const userId = decodeToken(req.cookies.jwt).id
            
            User.findById(userId).then(user => { 
                if(user.conselhoEco){
                    //console.log('Admin!')
                    next()
                }else{
                    res.status(403).send("This client is forbidden in this route")
                }
            })
        }else{
            res.status(401).send("Client is not authenticated") 
        }

    },
    auth_verifier: async (req,res,next)=>{
        // search token in headers most commonly used for authorization
        const header = req.headers['x-access-token'] || req.headers.authorization;
        if (typeof header == 'undefined'){
        //console.log('nao ha header') // trocar
        }

        if(verifyToken(req.cookies.jwt)){
            //console.log('Válido')

            const userId = decodeToken(req.cookies.jwt).id
            
            User.findById(userId).then(user => { 
                if(user.verifierEco){
                    //console.log('Verifier!')
                    next()
                }else{
                    res.status(403).send("This client is forbidden in this route")
                }
            })
        }else{
            res.status(401).send("Client is not authenticated") 
        }
    },
}