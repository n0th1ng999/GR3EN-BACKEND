const User = require('../models/user.model')
const Badge = require('../models/badge.model')
const occurrences = require('../models/occurrence.model')
const activities = require('../models/activities.model')


//Requerimentos
const giveBadgeForNumberOfOccurrences = (userid,nOcorrencias,idBadge) => {
    let occurrencesList = occurrences.find({idUser:req.params.idUser})
    let badge = Badge.findById(idBadge).exec()

    if(occurrencesList.length == nOcorrencias){
        let user = User.findById(userid).exec()
        User.updateOne({_id:userid},{$addToSet:{idBadge:idBadge} , pontos:user.pontos + badge.pontosBadge}).exec()
        return true
   } 
}

const giveBadgeForNumberOfActivities = (userid,nActivities,idBadge) => {
    let activitiesList = activities.find({idUser:req.params.idUser})
    let badge = Badge.findById(idBadge).exec()

    if(activitiesList.length == nActivities){
        let user = User.findById(userid).exec()
        User.updateOne({_id:userid},{$addToSet:{idBadge:idBadge} , pontos:user.pontos + badge.pontosBadge}).exec()
        return true
   } 
}

module.exports ={
    giveBadgeListForOccurrences:(userid)=>{
        const List_Of_Badges_For_Occurrences_Functions = [
            //O badge tem de existir (Obviamente)
            [1,'6464fef0974889a5887b91b3']
        ]
    
        List_Of_Badges_For_Occurrences_Functions.forEach(el => {
            if(giveBadgeForNumberOfOccurrences(userid,el[0],el[1])){
                return
        }})
        
    },
    giveBadgeListForActivities:(userid)=>{
        const List_Of_Badges_For_Activities_Functions = [
            //O badge tem de existir (Obviamente)
            [1,'6464fef0974889a5887b91b3']
        ]
    
        List_Of_Badges_For_Activities_Functions.forEach(el => {
            if(giveBadgeForNumberOfActivities(userid,el[0],el[1])){
                return
        }})
        
    }

}
