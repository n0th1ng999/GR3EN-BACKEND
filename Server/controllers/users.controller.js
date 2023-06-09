const User = require('../models/user.model.js')
const config = require('../config.js')
const bcrypt = require('bcrypt')
const jwtHelpers = require('./Helpers/jwtHelpers.js')
const isNumber = require('./Helpers/isNumber.js')



module.exports={

     getUser:(req,res) => {
            User.findOne({_id: req.params.userid}).select('-password')
            .then((result) => {
                if(result != {}){
                    res.status(200).json(result)
                }else{
                    res.status(404).send({message: "User not found."})
                }
            })
            .catch(err => res.status(500).send({error: err.message}))
    },
     getProfile:(req,res) => {
            User.findOne({_id: res.locals.userId})
            .then((result) => {
                if(result != {}){
                    res.status(200).json(result)
                }else{
                    res.status(404).send({message: "User not found."})
                }
            })
            .catch(err => res.status(500).send({error: err.message}))
    },

    editUser: async (req,res) => {
        delete req.body.pontos 
        if (req.body.password){
            await bcrypt.genSalt().then(
                salt => bcrypt.hash(req.body.password,salt).then( 
                    hash => req.body.password = hash
                )).catch(err => err)
        }
        User.updateOne({_id: req.params.userid}, req.body)
        .then(result => {
            if (result.acknowledged){
                if (result.matchedCount >0){
                    if(result.modifiedCount >0){
                        res.status(201).send({message: "User sucessfuly updated."})
                    }else{
                        res.status(400).send({message: "User not updated."})
                    }
                }else{
                    res.status(404).send({message: "User not Found."})
                }
            }else{
                res.status(400).send({message: "Params don't coincide with user object."})
            }
        })
        .catch((err) =>{res.status(500).send({err:err.message})})
    },
    editProfile: async (req,res) => {
        delete req.body.pontos 
        if (req.body.password){
            await bcrypt.genSalt().then(
                salt => bcrypt.hash(req.body.password,salt).then( 
                    hash => req.body.password = hash
                )).catch(err => err)
        }
        User.updateOne({_id: res.locals.userId}, req.body)
        .then(result => {
            if (result.acknowledged){
                if (result.matchedCount >0){
                    if(result.modifiedCount >0){
                        res.status(201).send({message: "Profile sucessfuly updated."})
                    }else{
                        res.status(400).send({message: "Profile not updated."})
                    }
                }else{
                    res.status(404).send({message: "Profile not Found."})
                }
            }else{
                res.status(400).send({message: "Params don't coincide with user object."})
            }
        })
        .catch((err) =>{res.status(500).send({err:err.message})})
    },
    
    deleteUser: (req,res) =>{
        User.deleteOne({_id: req.params.userid})
        .then((result) => {
            if (result.deletedCount > 0 ){
                res.status(204).send({message:`Sucessful deleted`})
            }else{
                res.status(404).send({message: "User not found."})
            }
        })    
        .catch((err) =>{res.status(500).send({err:err.message})})
    },
    deleteProfile: (req,res) =>{
        User.deleteOne({_id: res.locals.userId})
        .then((result) => {
            if (result.deletedCount > 0 ){
                res.status(204).send({message:`Profile Sucessfully deleted`})
            }else{
                res.status(404).send({message: "Profile not found."})
            }
        })    
        .catch((err) =>{res.status(500).send({err:err.message})})
    },

    titles : (req,res) => {
        User.updateOne({_id:req.params.userid},{ $addToSet: {idTitle:req.body.titles} } )
        .select('idBadge')
        .then(result => {
            if (result.acknowledged){
                if (result.matchedCount > 0){
                    if(result.modifiedCount >0){
                        res.status(201).send({message: "User sucessfuly updated, badge(s) added."})
                    }else{
                        res.status(400).send({message: "User not updated, badge(s) not added."})
                    }
                }else{
                    res.status(404).send({message: "User not Found."})
                }
            }else{
                res.status(400).send({message: "Params don't coincide with user object."})
            }
        })
        .catch(err => res.status(500).send({error: err.message}))
    },
    
    badges: (req,res) => {

        User.updateOne({_id:req.params.userid},{ $addToSet: {idBadge:req.body.badges} } )
        .select('idBadge')
        .then(result => {
            if (result.acknowledged){
                if (result.matchedCount > 0){
                    if(result.modifiedCount >0){
                        res.status(201).send({message: "User sucessfuly updated, badge(s) added."})
                    }else{
                        res.status(400).send({message: "User not updated, badge(s) not added."})
                    }
                }else{
                    res.status(404).send({message: "User not Found."})
                }
            }else{
                res.status(400).send({message: "Params don't coincide with user object."})
            }
        })
        .catch(err => res.status(500).send({error: err.message}))
    },

    login: async (req,res) => {
        if(req.body.password && req.body.email ){
            
        
        User.findOne({'email':req.body.email}).then(user => {
            bcrypt.compare(req.body.password,user.password).then(result => {
                if(result){
                    const token = jwtHelpers.createToken(user.id)
                    res.status(200).cookie('jwt',token).json({Token:token})
                }else{
                    res.status(401).json({error: 'Wrong Password'})
                }
            })
           
        }).catch(err => res.status(400).send({error:'User does not exist'}))
        }else{
            
            res.status(400).json({error:'Missing fields (The fields are the following: email,password)'})
        }
      },
    
    register:async (req,res) => {
        await bcrypt.genSalt().then(
            salt => bcrypt.hash(req.body.password,salt).then( 
                hash => req.body.password = hash
            )).catch(err => err)
            
        User.create(req.body)
        .then(user => {
            const token = jwtHelpers.createToken(user.id)
            res.status(201).cookie('jwt',token).json({Token:token})
        })
        .catch(err => res.status(400).json({error: err.message}))
        
    },

    getUsers: async (req,res) => {
    
        let {length=null, offset=null, users = null} = req.query

        if(users)  
            users = users.split(',')
        if(length && offset){
            if(isNumber(length) || isNumber(offset)){
                res.status(400).send({error: "Only numbers are allowed in offset and length queries"})
                return
            }

            User.find().select('-password').skip(offset).limit(length).then(users => { res.status(200).json(users)}).catch(err => { res.status(400).send({err: err.message})})
         
        }else if(length || offset){
            res.status(400).send({error: "You must use offset and length combined to get paginated results"})
            return
        }else if(users){
            User.find().where('_id').in(users)
            .select('-password')
            .then((users) => { res.status(200).json(users) })
            .catch(err => res.status(500).send({error: err.message}))
        }
        else{
            
            User.find().select('-password').then((users) => { res.status(200).json(users) })
            .catch(err => res.status(500).send({error: err.message}))
        }
    },


    
} 
