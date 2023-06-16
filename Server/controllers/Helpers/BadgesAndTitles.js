const Badge = require('../../models/badge.model')
const Title = require('../../models/title.model')
const Occurrence = require('../../models/occurrence.model')
const Activity = require('../../models/activity.model')
const { ObjectId } = require('mongodb')




module.exports ={
    //BADGES FUNCTIONS
    BadgeForActivities: async(user) => {
        const List_Of_Badges_For_Activities =  await Badge.find({type:"ActivityCounter"})

        const ActivityCount = await Activity.find({$and:[{participantesAtividadeExecutado:user._id},{statusAtividade:true}]}).countDocuments().exec()
        
        for (const badge of List_Of_Badges_For_Activities) {

            if(badge.requirement <= ActivityCount){
                if(!user.idBadge.some(badgeid => badgeid.equals(badge._id))){
                    user.idBadge.push(badge._id)
                    user.pontos = user.pontos + badge.pontosBadge
                     
                }
            }else{
                if(user.idBadge.some(badgeid => badgeid.equals(badge._id))){
                    user.idBadge = user.idBadge.filter(badgeid => !badgeid.equals(badge._id))
                    user.pontos = user.pontos - badge.pontosBadge
                }
            }
        }
        
    },
    BadgeForOccurrences: async(user) => {
        const List_Of_Badges_For_Occurrences =  await Badge.find({type:"OccurrenceCounter"})

        const OccurrenceCount = await Occurrence.find({$and:[{idUser:user._id},{statusOcorrencia:true}]}).countDocuments().exec()
        
  
        for (const badge of List_Of_Badges_For_Occurrences) {

            if(badge.requirement <= OccurrenceCount){
                if(!user.idBadge.some(badgeid => badgeid.equals(badge._id))){
                    
                    user.idBadge.push(badge._id)

                    user.pontos = user.pontos + badge.pontosBadge   
                }
            }else{
                if(user.idBadge.some(badgeid => badgeid.equals(badge._id))){

                    user.idBadge = user.idBadge.filter(badgeid => !badgeid.equals(badge._id))

                    user.pontos = user.pontos - badge.pontosBadge
                }
            }
        }
        
        await user.save()
    },
    BadgeForPoints: async(user) => {
      
        const List_Of_Badges_For_Points =  await Badge.find({type:"PointCounter"})
        
        for (const badge of List_Of_Badges_For_Points) {
            
           
            if(badge.requirement <= user.pontos){
                if(!user.idBadge.some(badgeid => badgeid.equals(badge._id))){
                    
                    user.idBadge.push(badge._id)
                    
                    user.pontos = user.pontos + badge.pontosBadge   
                    
                
                }
            }else{
                if(user.idBadge.some(badgeid => badgeid.equals(badge._id))){
                    user.idBadge = user.idBadge.filter(badgeid => !badgeid.equals(badge._id))
                    user.pontos = user.pontos - badge.pontosBadge

                
                }
              
            }
        }
        
      
        await user.save()
    },
    //Titles FUNCTIONS
    TitlesForActivities: async(user) => {
        const List_Of_Titles_For_Activities =  await Title.find({type:"ActivityCounter"})
        

        const ActivityCount = await Activity.find({$and:[{participantesAtividadeExecutado:user._id},{statusAtividade:true}]}).countDocuments().exec()
        
        for (const title of List_Of_Titles_For_Activities) {
            
            if(title.requirement <= ActivityCount){
                if(!user.idTitulo.some(titleid => titleid.equals(title._id))){

                    
                    user.idTitulo.push(title._id)
                    user.pontos = user.pontos + title.points
                    
                }
            }else{
                if(user.idTitulo.some(titleid => titleid.equals(title._id))){
                    user.idTitulo = user.idTitulo.filter(titleid => !titleid.equals(title._id))
                    user.pontos = user.pontos - title.points
                }
            }
        }
    
    },
    TitlesForOccurrences: async(user) => {
        const List_Of_Titles_For_Occurrences =  await Title.find({type:"OccurrenceCounter"})
        
        const OccurrenceCount = await Occurrence.find({$and:[{idUser:user._id},{statusOcorrencia:true}]}).countDocuments().exec()
        
        
        
        for (const title of List_Of_Titles_For_Occurrences) {
            
            if(title.requirement <= OccurrenceCount){
                if(!user.idTitulo.some(titleid => titleid.equals(title._id))){
                    user.idTitulo.push(title._id)
                    user.pontos = user.pontos + title.points   
                }
            }else{
                if(user.idTitulo.some(titleid => titleid.equals(title._id))){
                    user.idTitulo = user.idTitulo.filter(titleid => !titleid.equals(title._id))
                    user.pontos = user.pontos - title.points
                }
            }
        }
        
        
    },
    TitlesForPoints: async(user) => {
        
        const List_Of_Titles_For_Points =  await Title.find({type:"PointCounter"})
        
        for (const title of List_Of_Titles_For_Points) {
            
            if(title.requirement <= user.pontos){
                if(!user.idTitulo.some(titleid => titleid.equals(title._id))){
    
                    user.idTitulo.push(title._id)
                    user.pontos = user.pontos + title.points   

        
                }
            }else{
                if(user.idTitulo.some(titleid => titleid.equals(title._id))){
                    user.idTitulo = user.idTitulo.filter(titleid => !titleid.equals(title._id))
                    user.pontos = user.pontos - title.points
                }
            }
        }
        
     
        
    },
    
}
