const mongoose = require('mongoose')

const rankingSchema = mongoose.Schema({
    year: [Number] ,  
    users: {type: Array, required:true }
  },
  {
    timestamps:true
  })



module.exports = mongoose.model('rankings', rankingSchema)