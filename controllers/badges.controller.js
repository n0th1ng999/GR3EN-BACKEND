const Badge = require('../models/badge.model')

module.exports={

    getBadges: (req,res) => {
        let {badges = null} = req.query

        if(badges){
            badges = badges.split(',')

            Badge.find().where('_id').in(badges)
            .then((badges) => {res.status(206).json(badges)})
            .catch(err => res.status(400).send({error:err.message}))
            return
        }

        Badge.find()
        .then((result) => {res.status(200).json(result)})
    },

    getBadge: (req,res) => {
        Badge.findById({_id: req.params.badgeid})
        .then((result) => {
            if(result != {}){
                res.status(200).json(result)
               
            }else{
                res.status(404).send({message: "Badge not found."})
            }
        })
        .catch(err => res.status(500).send({error: err.message}))
    },

   
    createBadge: async (req,res) => {
        req.body.imagemBadge = req.files.imagemBadge.data.toString('base64')
        Badge.create(req.body)
        .then(result => res.status(201).send({message : 'Badge created.'}))
        .catch((err) =>{res.status(500).send({err:err.message})})
    },

    deleteBadge : (req,res) =>{
        Badge.deleteOne({_id: req.params.badgeid})
        .then((result) => {
            console.log(result)
            if (result.deletedCount > 0 ){
                res.status(204).send({message:`Sucessful deleted.`})
            }else{
                res.status(404).send({message: "Badge not found."})
            }
        })    
        .catch((err) =>{res.status(500).send({err:err.message})})
    },

    editBadge : (req,res) =>{
        if(req.files?.imagemBadge.data){
            req.body.imagemBadge = req.files.imagemBadge.data.toString('base64')
        }


        Badge.updateOne({_id:req.params.badgeid},req.body)
        .then(result => {
            if (result.acknowledged){
                if (result.matchedCount > 0){
                    if (result.modifiedCount > 0){
                        res.status(201).send({message: 'Badge sucessfuly updated.'})
                    }else{
                        res.status(400).send({message: 'Badge not updated.'})
                    }
                }else{
                    res.status(404).send({message: 'Badge not found'})
                }
            }else{
                res.status(400).send({message:"Params don't coincide with badge object."})
            }
        })
        .catch((err) => {res.status(500).send({err:err.message})})
    }
}