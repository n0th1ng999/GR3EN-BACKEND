const mongoose = require('mongoose')

const reqString = {
  required:true,
  type: String, 
}

const reqNumber = {
  required:true,
  type:Number,
}

const titleSchema = mongoose.Schema({
  name: reqString, // or like this {type: type , required: boolean}
  points: reqNumber,
})

module.exports = mongoose.model('titles', titleSchema)