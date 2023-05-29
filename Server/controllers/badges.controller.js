const Badge = require('../models/badge.model')
const User = require('../models/user.model')
const occurrences = require('../models/occurrence.model')


//Requerimentos
const giveBadge = (userid,nOcorrencias,idBadge) => {
    let occurrencesList = occurrences.find({idUser:req.params.idUser})
    let badge = Badge.findById(idBadge).exec()

    if(occurrencesList.length == nOcorrencias){
        let user = User.findById(userid).exec()
        User.updateOne({_id:userid},{$addToSet:{idBadge:idBadge} , pontos:user.pontos + badge.pontosBadge}).exec()
        return true
   } 
}

/* const giveBadge2 = (userid,nomeLocalAtividade,idBadge) => {

} */


module.exports={

    getBadges: (req,res) => {
        Badge.find()
        .then((result) => {res.status(200).json(result)})
    },

    getBadge: (req,res) => {
        Badge.findById({_id: req.params.badgeid})
        .then((result) => {
            if(result != {}){
                res.status(200).json(result)
                /* console.log(result) */
            }else{
                res.status(404).send({message: "User not found."})
            }
        })
        .catch(err => res.status(500).send({error: err.message}))
    },

    giveBadgeList:(userid)=>{
        const List_Of_Badge_Functions = [
            //O badge tem de existir (Obviamente)
            [1,'6464fef0974889a5887b91b3']
        ]

        List_Of_Badge_Functions.forEach(el => {
            if(giveBadge(userid,el[0],el[1])){
                return
        }})
        
    },

    createBadge: async (req,res) => {
        Badge.create(req.body)
        .then(res.status(201).send({message : 'Badge created.'}))
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