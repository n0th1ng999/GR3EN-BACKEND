const Occurrence = require('../models/occurrence.model')
const User = require('../models/user.model')
const isNumber = require('./Helpers/isNumber')
const {BadgeForOccurrences,BadgeForPoints,TitlesForOccurrences,TitlesForPoints} = require('./Helpers/BadgesAndTitles')

module.exports={

    getOccurrences: async (req,res) =>{
        let { length= null, offset=null, occurrences = null, userid = null } = req.query
        
        if(userid){
            try {
                res.status(200).json(await Occurrence.find({idUser:userid}))
                return
            } catch (error) {
      
                res.status(500).send()
                return
            } 
        }

        if(occurrences){

            occurrences = occurrences.split(',')      
            
        }
        if (length && offset){
            if(isNumber(length, (result)=>{return result}) || isNumber(offset, (result) => {return result})){    
                await res.status(400).send({error:"Only numbers are allowed in offset and length queries"})
                return
            }    
            Occurrence.find().skip(offset).limit(length).then(occurrences => {res.status(200).json(occurrences)}).catch(err => {res.status(400).send({err: err.message})})
        }else if(length || offset){
            await res.status(400).json({error:"Incorrect query use (you must use offset and length at the same time)"})
        }else if (occurrences){
            await Occurrence.find().where('_id').in(occurrences)
            .then((occurrences) => {res.status(206).json(occurrences)})
            .catch(err => res.status(400).send({err:err.message}))
        }else{
            
            await Occurrence.find({'statusOcorrencia': false}).then((occurrences)=>{
            res.status(200).json(occurrences)
            })
        }
        

        
        
    },
    
    addOccurrence:(req,res) => {
        req.body.dataOcorrencia = Date.now()
        req.body.statusOcorrencia = false
        req.body.idUser = res.locals.userId
        
        req.body.fotoOcorrencia = req.files.fotoOcorrencia.data.toString('base64')
      
        Occurrence.create(req.body)
        .then((occurrence) => {res.status(201).send(occurrence)})
        .catch((err) =>{res.status(400).send({error:err.message})})
    },

    editOccurrence: async (req,res) => {
        try {
            const occurrence =  await Occurrence.findById(String(req.params.occurrenceid)).exec()
            
            await Occurrence.findOneAndUpdate({_id: req.params.occurrenceid}, req.body).exec()

            if(req.body.hasOwnProperty('statusOcorrencia'))
            if(occurrence.statusOcorrencia != req.body.statusOcorrencia){

                occurrence.statusOcorrencia = req.body.statusOcorrencia
                

                const user = await User.findById(occurrence.idUser).exec() 
                
                
                if(req.body.statusOcorrencia == true){

                    user.pontos = user.pontos + occurrence.pontosOcorrencia
            
                    await BadgeForOccurrences(user)
                    await TitlesForOccurrences(user)
                    await BadgeForPoints(user)
                    await TitlesForPoints(user)
             
                }
                if(req.body.statusOcorrencia == false){
                    
                    user.pontos = user.pontos - occurrence.pontosOcorrencia
                    
                    await BadgeForOccurrences(user)
                    await TitlesForOccurrences(user)
                    await BadgeForPoints(user)
                    await TitlesForPoints(user)
             
                }

                await user.save()
            }

            
            res.status(201).send({message:"Edit Successuful", })
        } catch (error) {
            res.status(400).send({message:error.message})
        }
        
    },
    deleteOccurrence: (req,res) =>{
        Occurrence.deleteOne({_id: req.params.occurrenceid})
        .then((occurrence) => {
            if(occurrence.deletedCount){
                res.status(204).send({msg:"Successful Delete"})
            }else{
                res.status(404).send({msg:"Deletion not successful"})
            }
        }
        )
        .catch(err => {res.status(400).send({err:err.message})})
    }
}