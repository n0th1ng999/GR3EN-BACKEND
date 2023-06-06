const Occurrence = require('./../models/occurrence.model')
const User = require('./../models/user.model')
const isNumber = require('./Helpers/isNumber')
const {giveBadgeForOccurrences,removeBadgeForOccurrences} = require('./Helpers/BadgesAndTitles')

module.exports={

    getOccurrences: async (req,res) =>{
        let {length=null, offset=null, occurrences = null} = req.query
        
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
        Occurrence.create(req.body)
        .then((occurrence) => {res.status(201).send(occurrence)})
        .catch((err) =>{res.status(400).send({error:err.message})})
    },

    editOccurrence: async (req,res) => {
        
        
        try {
            const occurrence =  await Occurrence.findById(String(req.params.occurrenceid)).exec()
           
            if(req.body.hasOwnProperty('statusOcorrencia'))
            if(occurrence.statusOcorrencia != req.body.statusOcorrencia){
                const user = await User.findById(occurrence.idUser).exec() 
         
                
                if(req.body.statusOcorrencia == true){
                    user.pontos += occurrence.pontosOcorrencia
                    //verificar badges
                    giveBadgeForOccurrences(user._id)
                }
                if(req.body.statusOcorrencia == false){
            
                    user.pontos = user.pontos - occurrence.pontosOcorrencia
                  
                    User.updateOne({_id:user._id})
                    removeBadgeForOccurrences(user._id)
                }

                User.updateOne({_id: user._id}, user).exec()
            }

            Occurrence.updateOne({_id: req.params.occurrenceid}, req.body).exec()
            res.status(201).send({message:"Edit Successuful"})
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