const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
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
  default:false,
}

const reqString = {
  type: String,
  required:true, 
}

const reqStringUnique = {
  index: true,
  type: String,
  required:true,
  unique:true
}

const ArrayOfObjects = {
  type: [ObjectId],
  default:[]
}


const userSchema = mongoose.Schema({
  primeiroNome: reqString,
  ultimoNome: reqString,
  escola  : reqString,
  email: reqStringUnique,
  password: reqString,
  idBadge: ArrayOfObjects, 
  idTitulo: ArrayOfObjects, 
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