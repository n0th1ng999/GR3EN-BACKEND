const User = require('./../models/user.model.js')
const config = require('../config.js')
const bcrypt = require('bcrypt')
const jwtHelpers = require('./Helpers/jwtHelpers.js')

module.exports={
    createUser: (req,res) => {
        User.create(req.body)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json({error: err.message}))

    },
    getUsers:(req,res) => {
        let {length=null, offset=null, users = null} = req.query
        if(users)  
            users = users.split(',')
        if(length && offset){
    
            User.find().skip(offset).limit(length).then(users => { res.status(206).json(users)}).catch(err => { res.status(400).send({err: err.message})})
         
        }else if(users){
            User.find().where('_id').in(users)
            .then((users) => { res.status(206).json(users) })
            .catch(err => res.status(500).send({error: err.message}))
        }
    },

    getPartUser: (req,res) => {
        // user = { primeiroNome:String, ultimoNome:String, ultimoNome:String, escola:String, password : String , email : String,  }
        let {length=null, offset=null, users = null} = req.query
        if(users)  
            users = users.split(',')
        if(length && offset){
            User.find().skip(offset).limit(length).then(users => { res.status(206).json(users)}).catch(err => { res.status(400).send({err: err.message})})
        }else if(users){
            User.find().where('_id').in(users)
            .select('primeiroNome ultimoNome escola email password')
            .then((users) => { res.status(206).json(users) })
            .catch(err => res.status(500).send({error: err.message}))
        } 
    },

    editUser: (req,res) => {
        User.findOneAndUpdate({_id: res.params.userid}, req.params)
        .select('primeiroNome ultimoNome escola email password questionario conselhoEco')
        .then((user) => {res.status(201).send(user)})
        .catch((err) =>{res.status(500).send({err:err.message})})
    },
    
    deleteUser: (req,res) =>{
        User.findOneAndDelete({_id: res.params.userid}, req.params)
        .then(() => {res.status(204).send({message:`Sucessful deleted`})})
        .catch((err) =>{res.status(500).send({err:err.message})})
    },

    titles : (req,res) => {
        User.find().where('_id')
        .select('idTitulo')
        .then((users) => { res.status(200).json(users) })
        .catch(err => res.status(500).send({error: err.message}))
        },
    
    badges: (req,res) => {
        User.find().where('_id')
        .select('idBadge')
        .then((users) => { res.status(200).json(users) })
        .catch(err => res.status(500).send({error: err.message}))
    },
    login: async (req,res) => {
        console.log(req.body)
        User.findOne({'email':req.body.email}).then(user => {
        
            bcrypt.compare(req.body.password,user.password).then(result => {
                console.log(result)
                if(result){
                    const token = jwtHelpers.createToken(user.id)
                    res.status(200).cookie('jwt',token).json({Token:token})
                }else{
                    res.status(400).json({error: 'Wrong Password'})
                }
            })
           
        }).catch(err => res.status(400))

    },
    register:(req,res) => {
        User.create(req.body)
        .then(user => {
            const token = jwtHelpers.createToken(user.id)
            res.status(200).cookie('jwt',token).json({Token:token})
        })
        .catch(err => res.status(400).json({error: err.message}))
    }
}