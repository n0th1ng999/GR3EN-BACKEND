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

const reqBoolean ={
  type: Boolean,
  required:true,
}

const occurrenceSchema = mongoose.Schema({
  nomeOcorrencia: reqString,
  descricaoOcorrencia: reqString,
  localOcorrencia: reqString,
  dataOcorrencia: reqDate,
  idUser : reqNumber,
  fotoOcorrencia: reqString,
  pontosOcorrencia: {type:Number, required:true},
  categoriaOcorrencia: reqString,
  statusOcorrencia:reqBoolean,
  // or like this {type: type , required: boolean}
  
})

occurrenceSchema.pre(
  "save", (next)=>{
    this.dataOcorrencia = Date.now
    console.log(this.dataOcorrencia);
    next()
  }
)
module.exports = mongoose.model('occurrences', occurrenceSchema)