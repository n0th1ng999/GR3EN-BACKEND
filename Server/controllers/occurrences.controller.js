const Occurrence = require('./../models/occurrence.model')
const User = require('./../models/user.model')
const isNumber = require('./Helpers/isNumber')


module.exports={

    getOccurrences: (req,res) =>{
        let {length=null, offset=null, occurrences = null} = req.query
        
        if(occurrences){

            occurrences = occurrences.split(',')
            
                
            
        }
        if (length && offset){
            if(isNumber(length, (result)=>{return result}) || isNumber(offset, (result) => {return result})){    
                res.status(400).send({error:"Only numbers are allowed in offset and length queries"})
                return
            }    
            Occurrence.find().skip(offset).limit(length).then(occurrences => {res.status(206).json(occurrences)}).catch(err => {res.status(400).send({err: err.message})})
        }else if(length || offset){
            res.status(400).json({error:"Incorrect query use (you must use offset and length at the same time)"})
        }else if (occurrences){
            Occurrence.find().where('_id').in(occurrences)
            .then((occurrences) => {res.status(206).json(occurrences)})
            .catch(err => res.status(400).send({err:err.message}))
        }else{
            Occurrence.find({'statusOcorrencia': false}).then((occurrences)=>{
                res.status(200).json(occurrences)
            })
        }
        console.log(Occurrence.find({'statusOcorrencia': true}))

        
        
    },
    
    addOccurrence:(req,res) => {
        req.body.dataOcorrencia = Date.now()
        Occurrence.create(req.body)
        .then((occurrence) => {res.status(201).send(occurrence)})
        .catch((err) =>{res.status(400).send({error:err.message})})
    },

    editOccurrence: (req,res) => {
                   
        console.log(req.params.occurrenceid)
        Occurrence.findById(String(req.params.occurrenceid))
        .then(result => { 
            console.log(result)
            if(result?.statusOcorrencia != req.body?.statusOcorrencia){
                    //addPoints(result.idUser, result.pontosOcorrencia)}
            }else{
                    //removePoints(result.idUser, result.pontosOcorrencia)
                }
        }) 
        
       Occurrence.updateOne({_id: req.params.occurrenceid}, req.body)
        .then((occurrence) => {
            if (occurrence.modifiedCount > 0){
                res.status(201).send(occurrence)
            }else{
                res.status(404).send({msg:'Occurrence not found'})

        }})    
    },

    deleteOccurrence: (req,res) =>{
        Occurrence.deleteOne({_id: req.params.occurrenceid})
        .then((occurrence) => {
            console.log(occurrence);
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