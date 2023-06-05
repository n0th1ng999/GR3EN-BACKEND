const User = require('../../models/user.model')
const Badge = require('../../models/badge.model')
const Ocurrence = require('../../models/occurrence.model')
const Activity = require('../../models/activity.model')
const { ObjectId } = require('mongodb')


//BADGES FUNCTIONS --------------------------------------------------------------

//ACTVITY COUNTER
const giveBadgeForNumberOfActivities = async (userid,nActivities,badge) => {
    
    let activitiesList = await Activity.find({ $and: [{ participantesAtividadeExecutado:userid },{ statusAtividade:true}] }).exec()

    if(activitiesList.length == nActivities){
        let user = await User.findById(userid).exec()
        
        if(!user.idBadge.includes(badge._id)){

            user.idBadge.push(badge._id)
            
            user.pontos += badge.pontosBadge
        }
     
        User.updateOne({_id:userid},user).exec()
    
        return true
   } 
}

const removeBadgeForNumberOfActivities = async (userid,nActivities,badge) => {
    let activitiesList = await Activity.find({ $and: [{ participantesAtividadeExecutado:userid },{ statusAtividade:true}] }).exec()
   

    if((activitiesList.length + 1) == nActivities){
        let user = await User.findById(userid).exec()
        user.idBadge = user.idBadge.filter(badge => !badge.equals(badge._id) )
        user.pontos = user.pontos - badge.pontosBadge
        
        User.updateOne({_id:userid},user).exec()
        
        return true
   } 
}

//OCCURRENCE COUNTER
const giveBadgeForNumberOfOccurrences = async (userid,nOccurrences,badge) => {
    let occurrencesList = await Ocurrence.find({ $and: [{ idUser:userid },{ statusOcorrencia:true}] }).exec()

    if(occurrencesList.length == nOccurrences){
        
        let user = await User.findById(userid).exec()
        
        if(!user.idBadge.includes(badge._id)){

            user.idBadge.push(badge._id)
            
            user.pontos += badge.pontosBadge
        }
        
        
        User.updateOne({_id:userid},user).exec()
    
        return true
   } 
}

const removeBadgeForNumberOfOccurrences = async (userid,nOccurrences,badge) => {
    let occurrencesList = await Ocurrence.find({ $and: [{ idUser:userid },{ statusOcorrencia:true}] }).exec()
   
    if((occurrencesList.length + 1) == nOccurrences){
        let user = await User.findById(userid).exec()
        user.idBadge = user.idBadge.filter(badge => !badge.equals(badge._id) )
        user.pontos = user.pontos - badge.pontosBadge
        
        User.updateOne({_id:userid},user).exec()
        
        return true
   } 
}

//POINT COUNTER
const giveBadgeForNumberOfPoints = async(userid,points,badge)=>{
    
    const user = await User.findById(userid)

    if(user.pontos >= points){
        user.idBadge.push(badge._id)
        
        await user.save()
    } 
}

const removeBadgeForNumberOfPoints = async(userid,points,badge)=>{
    const user = await User.findById(userid)

    if(user.pontos >= points){
        user.idBadge.push(badge._id)
        await user.save()
    }
}

module.exports ={
    //BADGES FUNCTIONS

    //ACTVITY COUNTER
    giveBadgeForActivities: async (userid)=>{

        const List_Of_Badges_For_Activities =  await Badge.find({type:"ActivityCounter"})
       
        List_Of_Badges_For_Activities.forEach(badge => {
            giveBadgeForNumberOfActivities(userid,badge.requirement,badge)
                
        })
        
    },
    RemoveBadgeForActivities: async (userid)=>{
        const List_Of_Badges_For_Activities =  await Badge.find({type:"ActivityCounter"})
       
        
        List_Of_Badges_For_Activities.forEach(badge => {
            removeBadgeForNumberOfActivities(userid,badge.requirement,badge)       
        })
        
    },
    //OCCURRENCE COUNTER
    giveBadgeForOccurrences: async (userid)=>{

        const List_Of_Badges_For_Occurrences =  await Badge.find({type:"OccurrenceCounter"})
        
        List_Of_Badges_For_Occurrences.forEach(badge => {
            giveBadgeForNumberOfOccurrences(userid,badge.requirement,badge)
                
        })
        
    },
    removeBadgeForOccurrences: async (userid)=>{
        const List_Of_Badges_For_Occurrences =  await Badge.find({type:"OccurrenceCounter"})
    
        List_Of_Badges_For_Occurrences.forEach(badge => {
            removeBadgeForNumberOfOccurrences(userid,badge.requirement,badge)
                
        })
        
    },
    //POINT COUNTER
    giveBadgeForPoints: async (userid)=>{

        const List_Of_Badges_For_Points =  await Badge.find({type:"OccurrencePoints"})
        
        List_Of_Badges_For_Points.forEach(badge => {
            giveBadgeForNumberOfPoints(userid,badge.requirement,badge)
                
        })
        
    },
    removeBadgeForPoints: async (userid)=>{
        const List_Of_Badges_For_Points =  await Badge.find({type:"OccurrencePoints"})
    
        List_Of_Badges_For_Points.forEach(badge => {
            removeBadgeForNumberOfPoints(userid,badge.requirement,badge)
                
        })
        
    },
    
}
