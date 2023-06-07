const Title = require('./../models/title.model')
const isNumber = require('./Helpers/isNumber')

module.exports={
    getTitles: (req,res) =>{
        let {length = null, offset=null, titles = null} = req.query
        
        if(titles){
            titles = titles.split(',')
            titles.forEach(title => {
                isNumber(title, (result)=>{
                    if(!result){
                        res.status(400).send({error:"Only numbers are allowed in title query."})
                    }
                })
            });
        }

        if(length && offset){
            if(isNumber(length, (result) => {return result}) || isNumber(offset, (result) => {return result})){
                res.status(400).send({error:"Only numbers are allowed in offset and length queries."})
                return   
            }
            Title.find().skip(offset).limit(length).then(titles => {res.status(206).json(titles)}).catch(err => {res.status(400).send({error: err.message})})
        }else if(length || offset){
            res.status(400).json({error:"Incorrect query use (you must use offset and length at the same time)"})
        
        }else if(titles){
            Title.find().where('_id').in(titles)
            .then((titles) => {res.status(206).json(titles)})
            .catch(err => res.status(400).send({error:err.message}))
        }else{
            Title.find().then((titles) =>{
                res.status(200).json(titles)
            })
        }
    },

    createTitle:(req,res) =>{
        Title.create(req.body)
        .then((title) => {res.status(201).send({message: 'Successuful title Creation'})})
        .catch(err => {res.status(400).send({error:err.message})})
    },

    editTitle:(req,res) =>{
        Title.updateOne({_id:req.params.id},req.body)
        .then(title =>{
            if(title.matchedCount > 0){
                if(title.modifiedCount > 0){
                    res.status(201).send({message: 'Successuful edit'})
                }else{
                    res.status(400).send({error:'Title not updated'})
                }
            }else{
                res.status(404).send({error:'Title not found'})
            }
        })
        .catch(err =>{res.status(400).send({error:err.message})})
    },

    deleteTitle:(req,res) => {
        Title.deleteOne({_id:req.params.id})
        .then(title =>{
            if(title.deletedCount){
                res.status(204).send({message:'Deleted'})
            }else{
                res.status(404).send({error:'Deletion not successful'})
            }
        })
        .catch(err => {res.status(400).send({error:err.message})})
    }
}