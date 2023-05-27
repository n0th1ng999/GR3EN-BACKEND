const Ranking = require("./../models/ranking.model")
const User = require("./../models/user.model")
const isNumber = require('./Helpers/isNumber')

module.exports={
    createRanking: async (req,res) => {
        
        let topUsers = await User.find()
        .sort({ pontos: -1 }).limit(10).lean()
        .then()
        .catch(err => {});

        const rankingData = topUsers.map(topUsers => ({id: topUsers.id, pontos:topUsers.pontos, primeiroNome: topUsers.primeiroNome }))
        
        let LastYearRanking = await Ranking.findOne().sort({createdAt: -1}).limit(1).lean().then().catch(err => {})
        
        let NewRanking

        if(LastYearRanking){
            
            NewRanking = Ranking.create(
                {
                    year:[Number(LastYearRanking.year[0])+1,Number(LastYearRanking.year[1])+1],
                    users:rankingData
                }).then(result => res.status(201).json({message: "New Ranking Sucessufully Created"}))
            User.updateMany({},{$set: {pontos: 0}}).then().catch(err => {
            
            })
        }else{
            NewRanking = await Ranking.create(
                {
                    year:[Number(new Date(Date.now()).getFullYear()),Number(new Date(Date.now()).getFullYear())+1],
                    users:rankingData
                }).then(result => res.status(201).json({message: "New Ranking Sucessufully Created"}))
            User.updateMany({},{$set: {pontos: 0}})
            
        }
     
        
    },
    getRankings: (req,res) => {
        let {length=null, offset=null, year = null} = req.query

        if(year)  
        year = year.split('-')
        
        
        if(length && offset){
            if(isNumber(length) || isNumber(offset)){
                res.status(400).send({error: "Only numbers are allowed in offset and length queries"})
                return
            }
            Ranking.find().skip(offset).limit(length).then(rankings => { res.status(206).json(rankings)}).catch(err => { res.status(400).send({err: err.message})})
        
        }else if(length || offset){
            res.status(400).send({error: "You must use offset and length combined to get paginated results"})
            return

        }else if(year){
            if(!(year[0] && year[1])){
                res.status(400).send({error: "Bad query 'year' use: years missing (correct use example: ?year=2025-2026)"})
                return
            }

            if(isNumber(year[0]) || isNumber(year[1])){
                res.status(400).send({error: "Only numbers are allowed in year query"})
                return
            }
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