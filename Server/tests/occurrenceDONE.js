const {app,server} = require('../app')
const Occurrence = require('../models/occurrence.model')
const User = require('../models/user.model')
const request = require('supertest')
const mongoose = require('mongoose')
const databaseLink = process.env.MONGODB_URI
const RealDate = Date.now
const {decodeToken,verifyToken,createToken} = require('../controllers/Helpers/jwtHelpers')

const path = require('path');
const { expect } = require('chai')

const { log } = require('console')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
beforeAll(async() =>{

  await mongoose.connect(process.env.MONGODB_URI)
  console.log("ola")
}) 

beforeEach(async() =>{
    await Occurrence.deleteMany({})
    await User.deleteMany({})
})

afterAll( async ()=>{
    await Occurrence.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
})
  
let userId
describe('creating new occurrence', ()=>{
  it('returns status code 201 if occurrence is created', async()=>{
    
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const userCreate = await request(app).post('/users').send(user)
    
    userId = decodeToken(userCreate.body.Token).id
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : userId,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };

    const userToken = createToken(userId)
    const res = await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    expect(res.statusCode).equal(201);
  })
  it('returns status code 400 if there are any fields missing', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const userCreate = await request(app).post('/users').send(user)
    userId = decodeToken(userCreate.body.Token).id
    const userToken = createToken(userId)
    const res = await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    expect(res.statusCode).equal(400);
  })

  it('returns status code 401 if auth key is invalid', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const res = await request(app).post('/occurrences').send(data)
    expect(res.statusCode).equal(401);
  })
})

describe('Get Occurrences', ()=>{
  it('returns status code 200 if successfull request', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    console.log(userId)
    const userToken = createToken(String(userId))
    await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const res = await request(app).get('/occurrences').set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(200)
  })
  
  it('returns status code 200 if successfull request and correct query use', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const createOcc =await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const res = await request(app).get('/occurrences?offset=0&length=2').set('Authorization', 'Bearer ' + userToken)
    console.log(createOcc.body)
    expect(res.statusCode).equal(200)
  })
  it('returns status code 400 if incorrect query use', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const res = await request(app).get('/occurrences?offset=1').set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(400)
  })
  it('returns status code 400 if incorrect query use (only numbers allowed)', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const res = await request(app).get('/occurrences?offset=a&length=s').set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(400)
  })

  it('returns status code 201 if occurrence state changes', async()=>{
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const data ={
      nomeOcorrencia: "funciona por favor", 
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : userId,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(userId)
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).put(`/occurrences/${OccID}`).set('Authorization', 'Bearer ' + userToken).send()
    console.log(res)
    expect(res.statusCode).equal(201)
  })
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).put('/occurrences/' + OccID).send({statusOcorrencia:true})
    expect(res.statusCode).equal(401)
  })
  it('returns status code 403 if not allowed', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).put('/occurrences/' + OccID).set('Authorization', 'Bearer ' + userToken).send({statusOcorrencia:true})
    expect(res.statusCode).equal(403)
  })
  it('returns status code 404 if occurrence not found', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = ""
    const res = await request(app).put('/occurrences/' + OccID).set('Authorization', 'Bearer ' + userToken).send({statusOcorrencia:true})
    expect(res.statusCode).equal(404)
  })
  
})

describe('Delete Occurrence', ()=>{
  it('returns status code 204 deleted', async()=>{
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : userId,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const userToken = createToken(userId)
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).delete('/occurrences/' + OccID).set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(204)
  })
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).delete('/occurrences/' + OccID)
    expect(res.statusCode).equal(401)
  })

  it('returns status code 403 if not allowed', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = String(postOcc.body._id)
    const res = await request(app).delete('/occurrences/' + OccID).set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(403)
  })
  it('returns status code 404 if occurrence not found', async()=>{
    const data ={
      nomeOcorrencia: "funciona por favor",
      descricaoOcorrencia: "funciona por favor",
      localOcorrencia: "funciona por favor",
      dataOcorrencia: Date.now(),
      idUser : 1,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };
    const user =
    {
      primeiroNome:"test1",
      ultimoNome:"test1",
      escola:"ESMAD1",
      email:"test1@mail.com",
      password:"test1",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: true, 
      pontos:0,
    }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const postOcc= await request(app).post('/occurrences').set('Authorization', 'Bearer ' + userToken).send(data)
    const OccID = ""
    const res = await request(app).delete('/occurrences/' + OccID).set('Authorization', 'Bearer ' + userToken)
    expect(res.statusCode).equal(404)
  })
})