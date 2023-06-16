const {app,server} = require('../app')
const User = require('../models/user.model')
const Badge = require('../models/badge.model')
const request = require('supertest')
const mongoose = require('mongoose')
const databaseLink = process.env.MONGODB_URI
const RealDate = Date.now
const {decodeToken,verifyToken,createToken} = require('../controllers/Helpers/jwtHelpers')

const path = require('path');
const { expect } = require('chai')


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
beforeAll(async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
}) 

beforeEach(async() =>{
    await Badge.deleteMany({})
    await User.deleteMany({})
})

afterAll( async ()=>{
    await Badge.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
})

describe('GET badges', ()=>{
    it('returns status code 200 if correct query use', async()=>{
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
        const data =
        {
          nomeBadge: "reqString", 
          descricaoBadge: "reqString",
          imagemBadge: "reqString",
          pontosBadge: 10,
          type: "ActivityCounter",
          requirement: 5
        };
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).get('/badges').set('Authorization', 'Bearer ' + userToken)
        expect(res.statusCode).equal(200)
      })
    it('returns status code 200 if correct query use', async()=>{
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
        const data =
        {
          nomeBadge: "reqString", 
          descricaoBadge: "reqString",
          imagemBadge: "reqString",
          pontosBadge: 10,
          type: "ActivityCounter",
          requirement: 5
        }
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).get('/badges?offset=1&length=1').set('Authorization', 'Bearer ' + userToken).send(data)
        expect(res.statusCode).equal(200)
      })
    it('returns status code 404 if badge not found', async()=>{
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
        const data =
        {
          nomeBadge: "reqString", 
          descricaoBadge: "reqString",
          imagemBadge: "reqString",
          pontosBadge: 10,
          type: "ActivityCounter",
          requirement: 5
        }
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const createBadge = await request(app).post('/badges').set('Authorization', 'Bearer ' + userToken).send(data)
        const res = await request(app).get('/badges/').set('Authorization', 'Bearer ' + userToken)
        expect(res.statusCode).equal(200)
      })
})

describe('POST Badges', ()=>{
  it('returns status code 201 if badge created', async()=>{
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
    const data =
        {
          nomeBadge: "reqString", 
          descricaoBadge: "reqString",
          imagemBadge: "reqString",
          pontosBadge: 10,
          type: "ActivityCounter",
          requirement: 5
        }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const res = await request(app).post('/badges').set('Authorization', 'Bearer ' + userToken).send(data)
    expect(res.statusCode).equal(201)
  })
  it('returns status code 200 if badge is given', async()=>{
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
    const data =
        {
          nomeBadge: "reqString", 
          descricaoBadge: "reqString",
          imagemBadge: "reqString",
          pontosBadge: 10,
          type: "ActivityCounter",
          requirement: 5
        }
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const res = await request(app).post('/badges').set('Authorization', 'Bearer ' + userToken).send(data)
    expect(res.statusCode).equal(200)
  })
})