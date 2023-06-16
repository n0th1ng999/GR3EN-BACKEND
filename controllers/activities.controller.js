const Activity = require('../models/activity.model')
const User = require('../models/user.model')
const isNumber = require('./Helpers/isNumber')
const {BadgeForActivities,BadgeForPoints,TitlesForActivities,TitlesForPoints} = require('./Helpers/BadgesAndTitles')

// Create a collection 
// Activity.createCollection().then((collection) => {console.log(collection)}).catch(err => {console.log(err)})

module.exports={
    getActivities:async (req, res)=> {
        let {length=null, offset=null, activities = null, userid = null} = req.query
        
        if(userid){
            try {
                res.status(200).json(await Activity.find({$or:[{participantesAtividadeExecutado:userid},{participantesAtividadeNaoExecutado:userid}]}))
                return
            } catch (error) {
      
                res.status(500).send()
                return
            } 
        }
        
        if(activities) {
            activities = activities.split(',')
        }
        
        if(length && offset){   
           
            if(isNumber(length) || isNumber(offset)){
                await res.status(400).send({error: "Only numbers are allowed in offset and length queries"})
                return
            }
        
            Activity.find().skip(offset).limit(length).then(activities => { res.status(200).json(activities)}).catch(err => { res.status(400).send({err: err.message})})
         
        }else if(length || offset){

            await res.status(400).json({error: "Incorrect query use (you must use offset and length at the same time)"})
        
        }else if(activities){

            await Activity.find().where('_id').in(activities)
            .then((activities) => { res.status(206).json(activities) })
            .catch(err => res.status(400).send({error: err.message}))

        }else{

            await Activity.find().then((activities)=>{
                res.status(200).json(activities)
            })

        }
    },
    createActivity: async  (req,res) => {

        req.body.coordenadorAtividade = res.locals.userId
        req.body.dataHoraAtividade = Date.now()
        req.body.statusAtividade =  false

        req.body.imagemAtividade = req.files.imagemAtividade.data.toString('base64')

        Activity.create(req.body)   
        .then((activity) => { res.status(201).send(activity)})
        .catch((err) => {res.status(400).send({error: err.message})})
    },
    editActivity: async (req,res) => {
        delete req.body.statusAtividade
        delete req.body.participantesAtividadeNaoExecutado
        delete req.body.participantesAtividadeExecutado
        Activity.updateOne({_id: req.params.activityid}, req.body)
        .then(activity => { 
            if(activity.modifiedCount > 0){
                res.status(201).send(activity)}
            else{
                res.status(404).send({error: 'Activity not found (Wrong Id)'})
                }
            })
        .catch(err => { res.status(400).send({err: err.message})})
    },
    deleteActivity:async  (req,res) => {
        Activity.deleteOne({_id: req.params.activityid})
        .then(activity => { 
            if(activity.deletedCount){
                res.status(204).send({msg: 'deletion successuful'})
            }else{
                res.status(404).send({msg: 'Deletion not succesuful (Wrong ID)'})
            }

        })
        .catch(err => { res.status(400).send({error: err.message})})
    },
    addUserToActivity: async (req,res) => {
        
        Activity.findById(req.params.activityid).then(result => {
            if( result.participantesAtividadeNaoExecutado.some(id => id == req.params.userid)
            ||  result.participantesAtividadeExecutado.some(id => id == req.params.userid)){
                res.status(400).send({error: 'user already exists'})
            }else{  
                Activity.findOneAndUpdate({_id: req.params.activityid }, { $addToSet: {participantesAtividadeNaoExecutado : req.params.userid}})
                .then(result => {res.status(201).send(result)})
                .catch(err => {res.status(400).send(err.message)});
            }
        })

    },
    enroll: async (req,res) => {
        
       
        Activity.findById(req.params.activityid).then(result => {
            if( result.participantesAtividadeNaoExecutado.some(id => id == res.locals.userId)
            ||  result.participantesAtividadeExecutado.some(id => id == res.locals.userId)){
                res.status(400).send({error: 'user already exists'})
            }else{  
                Activity.findOneAndUpdate({_id: req.params.activityid }, { $addToSet: {participantesAtividadeNaoExecutado : res.locals.userId}})
                .then(result => {res.status(201).send(result)})
                .catch(err => {res.status(400).send(err.message)});
            }
        })

    },
    removeUserFromActivity: async (req,res) => {

         Activity.updateOne({_id: req.params.activityid }, { $pull: {participantesAtividadeExecutado : req.params.userid},  $pull: {participantesAtividadeNaoExecutado : req.params.userid }})
        .then(result => {
            console.log(result)
            if(result.modifiedCount > 0){
                res.status(204).send('tudo certo')  
            }else{
                res.status(400).json({error:'User does not exist'})
            }
        })
        .catch(err => {
            res.status(400).send(err.message)
        });
        
    },
    unEnroll: async (req,res) => {

         Activity.updateOne({_id: req.params.activityid }, { $pull: {participantesAtividadeExecutado : res.locals.userId},  $pull: {participantesAtividadeNaoExecutado : res.locals.userId }})
        .then(result => {
            console.log(result)
            if(result.modifiedCount > 0){
                res.status(204).send('User removed from activity')  
            }else{
                res.status(400).json({error:'User does not exist'})
            }
        })
        .catch(err => {
            res.status(400).send(err.message)
        });
        
    },
    changeUserState: async (req,res) => {
        console.log('starting')
        let activity
        try {
            activity = await Activity.findById(req.params.activityid).exec()
            
            if(activity.participantesAtividadeNaoExecutado.some(user => user ==  req.params.userid)){
    
                activity.participantesAtividadeNaoExecutado = activity.participantesAtividadeNaoExecutado.filter(user => user != req.params.userid)
                activity.participantesAtividadeExecutado.push(req.params.userid)
    
            }else if(activity.participantesAtividadeExecutado.some(user => user ==  req.params.userid)){
                
                activity.participantesAtividadeExecutado = activity.participantesAtividadeNaoExecutado.filter(user => user != req.params.userid)
                activity.participantesAtividadeNaoExecutado.push(req.params.userid)
    
            }else{
    
                res.status(404).send({error:"User does not exist in activity"})
                return
            }
        } catch (error) {
            res.status(400).send({message:error.msg})
            return
        }


        try {
            await Activity.updateOne({_id: req.params.activityid}, activity).exec()
        } catch (error) {
            res.status(500).send({message:error.msg})
            return
        }

        res.status(201).send({message: 'User Status sucessufully changed'})
        
       
    },
    changeActivityState: async (req,res)=>{

        try{
           let activity = await Activity.findOne({_id: req.params.activityid}).exec()

           Activity.updateOne({_id: activity._id},{statusAtividade:!activity.statusAtividade}).exec()
           
           let users = await User.find({_id:activity.participantesAtividadeExecutado}).exec()
           
           if(!activity.statusAtividade){
               users.map(user => user.pontos = user.pontos + activity.pontosAtividade)         
                for (const user of users) {
                    
                    await BadgeForActivities(user)
                    await TitlesForActivities(user)
                    await BadgeForPoints(user)
                    await TitlesForPoints(user)

                }
            }else{
                users.map(user => user.pontos = user.pontos - activity.pontosAtividade)
                for (const user of users) {
                    
                    await BadgeForActivities(user)
                    await TitlesForActivities(user)
                    await BadgeForPoints(user)
                    await TitlesForPoints(user)
                    
                }
                           
           }
           users.forEach(user => User.updateOne({_id: user._id}, user).exec())
   
           res.status(200).send({message:'Activity Changed'})
        }catch(err){
            res.status(400).send({error:err.message})
        }
       
    }
}