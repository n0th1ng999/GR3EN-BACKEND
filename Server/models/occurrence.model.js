const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const reqDate = {
  type: Date,
  required:true,
  default: (Date.now) 
}
const reqString = {
  type: String,
  required:true,
  immutable:true 
}

const reqNumber = {
  type: Number,
  required:true,
  immutable:true 
}

const reqObjectId = {
  type: ObjectId,
  required:true,
  immutable:true 
}

const reqBoolean ={
  default:false,
  type: Boolean,
  required:true,
}

const occurrenceSchema = mongoose.Schema({
  nomeOcorrencia: reqString,
  descricaoOcorrencia: reqString,
  localOcorrencia: reqString,
  dataOcorrencia: reqDate,
  idUser : reqObjectId,
  fotoOcorrencia: reqString,
  pontosOcorrencia: {type:Number, required:true},
  categoriaOcorrencia: reqString,
  statusOcorrencia:reqBoolean ,
  // or like this {type: type , required: boolean}
  
})

occurrenceSchema.pre(
  "save", (next)=>{
    this.dataOcorrencia = Date.now
    next()
  }
)
module.exports = mongoose.model('occurrences', occurrenceSchema)