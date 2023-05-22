const mongoose = require('mongoose')

const reqString = {
  type: String, 
  required: true,
}

const reqNumber = {
  type: Number, 
  required: true
}

const badgeSchema = mongoose.Schema({
  nomeBadge: reqString, // or like this {type: type , required: boolean}
  descricaoBadge: reqString,
  imagemBadge: reqString,
  pontosBadge: reqNumber
})

module.exports = mongoose.model('badges', badgeSchema)