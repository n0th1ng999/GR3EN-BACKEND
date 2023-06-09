const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const reqString = {
  type: String,
  required:true, 
}

const reqArrayOfObjects = {
  type: [ObjectId],
  required:true, 
  default:[]
}

const reqNumber = {
  type: Number,
  required:true, 
}

const reqDate = {
  type: Date,
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
  participantesAtividadeNaoExecutado: reqArrayOfObjects,
  participantesAtividadeExecutado: reqArrayOfObjects,
  nomeAtividade:reqString,
  descAtividade: reqString,
  imagemAtividade: reqString,
  dataHoraAtividade: reqDate,
  localAtividade: reqString,
  coordenadorAtividade: reqObjectId,
  pontosAtividade: reqNumber,
  statusAtividade: reqBoolean,
})

module.exports = mongoose.model('activities', activitySchema)