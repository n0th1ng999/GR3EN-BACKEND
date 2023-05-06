const Ranking = require("./../models/ranking.model")
const User = require("./../models/user.model")

module.exports={
    createRanking: async (req,res) => {
        
        let topUsers = await User.find()
        .sort({ pontos: -1 }).limit(10).lean()
        .then()
        .catch(err => {});

        const rankingData = topUsers.map(topUsers => ({id: topUsers.id, pontos:topUsers.pontos }))
        
        let LastYearRanking = await Ranking.findOne().sort({createdAt: -1}).limit(1).lean().then().catch(err => {})
        
        let NewRanking

        if(LastYearRanking){
            
            NewRanking = Ranking.create(
                {
                    year:[Number(LastYearRanking.year[0])+1,Number(LastYearRanking.year[1])+1],
                    users:rankingData
                }).then(result => res.status(201).json(result))
            User.updateMany({},{$set: {pontos: 0}}).then().catch(err => {
            
            })
        }else{
            NewRanking = await Ranking.create(
                {
                    year:[Number(new Date(Date.now()).getFullYear()),Number(new Date(Date.now()).getFullYear())+1],
                    users:rankingData
                }).then(result => res.status(201).json(result))
            User.updateMany({},{$set: {pontos: 0}})
            
        }
     
        
    },
    getRankings: (req,res) => {
        let {length=null, offset=null, year = null} = req.query

        if(year)  
        year = year.split('-')
        
        console.log(year)
        
        if(length && offset){
    
            Ranking.find().skip(offset).limit(length).then(rankings => { res.status(206).json(rankings)}).catch(err => { res.status(400).send({err: err.message})})
        
        }else if(year){
            Ranking.find({ 
                $and: [{ year: { $eq: Number(year[0]) } },{ year: { $eq: Number(year[1]) } }]
              }).lean() 
            .then((rankings) => { res.status(206).json(rankings) })
            .catch(err => res.status(400).send({error: err.message}))
        }else{
            Ranking.find().then(rankings => { res.status(200).json(rankings)}).catch(err => { res.status(400).send({err: err.message})})
        }
    }
    

}