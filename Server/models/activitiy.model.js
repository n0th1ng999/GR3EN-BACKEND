const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const reqString = {
  type: String,
  required:true, 
}

const reqArray = {
  type: Array,
  required:true, 
}

const reqNumber = {
  type: Number,
  required:true, 
}

const reqObjectId = {
  type: ObjectId,
  required:true, 
}

const reqBoolean = {
  type: Boolean,
  required:true, 
  default:false
}



const activitySchema = mongoose.Schema({
  participantesAtividadeNaoExecutado: reqArray,
  participantesAtividadeExecutado: reqArray,
  nomeAtividade:reqString,
  descAtividade: reqString,
  imagemAtividade: reqString,
  dataHoraAtividade: reqString,
  localAtividade: reqString,
  coordenadorAtividade: reqObjectId,
  pontosAtividades: reqNumber,
  statusAtividade: reqBoolean,
})

module.exports = mongoose.model('activities', activitySchema)