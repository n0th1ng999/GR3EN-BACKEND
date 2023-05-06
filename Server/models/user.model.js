const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const reqArray = {
  type: Array,
  required:true, 
}

const reqNumber = {
  type: Number,
  required:true, 
}

const reqBoolean = {
  type: Boolean,
  required:true, 
}

const reqString = {
  type: String,
  required:true, 
}



const userSchema = mongoose.Schema({
  primeiroNome: reqString,
  ultimoNome: reqString,
  escola: reqString,
  email: reqString,
  password: reqString,
  idBadge: reqArray, 
  idTitulo: reqArray, 
  ranking: reqNumber, 
  idOcorrencia: reqArray, 
  idAtividade: reqArray, 
  conselhoEco: reqBoolean, 
  verifierEco: reqBoolean, 
  pontos: {
    type: Number,
    default: 0,
  }
})

userSchema.pre('save', async (next) => {
  this.pontos = 0;
  
  
  
  

  next();
});






module.exports = mongoose.model('Users', userSchema)  
