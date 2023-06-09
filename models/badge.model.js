const mongoose = require('mongoose')

const reqString = {
  type: String, 
  required: true,
}

const reqNumber = {
  type: Number, 
  required: true
}
const type = {
  required: true,
  type: String,
  enum: ['ActivityCounter', 'OccurrenceCounter', 'PointCounter'],
}


const badgeSchema = mongoose.Schema({
  nomeBadge: reqString, 
  descricaoBadge: reqString,
  imagemBadge: reqString,
  pontosBadge: reqNumber,
  type: type,
  requirement: reqNumber
})

module.exports = mongoose.model('badges', badgeSchema)