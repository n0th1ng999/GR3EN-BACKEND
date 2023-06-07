const {app,server} = require('../app')
const User = require('../models/user.model')
const Title = require('../models/title.model')
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
    await Title.deleteMany({})
    await User.deleteMany({})
})

afterAll( async ()=>{
    await Title.deleteMany({})
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
            name: "reqString", // or like this {type: type , required: boolean}
            points: 10,
        };
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).get('/titles').set('Authorization', 'Bearer ' + userToken).send(data)
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
            name: "reqString", // or like this {type: type , required: boolean}
            points: 10,
        };
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).get('/titles?offset=1&length=1').set('Authorization', 'Bearer ' + userToken).send(data)
        expect(res.statusCode).equal(200)
      })
      it('returns status code 400 if incorrect query use', async()=>{
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
            name: "reqString", // or like this {type: type , required: boolean}
            points: 10,
        };
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).post('/titles?offset=1').set('Authorization', 'Bearer ' + userToken).send(data)
        expect(res.statusCode).equal(400)
      })
      it('returns status code 400 if incorrect query use', async()=>{
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
            name: "reqString", // or like this {type: type , required: boolean}
            points: 10,
        };
        const createUser = await request(app).post('/users').send(user)
        userId=decodeToken(createUser.body.Token).id
        const userToken = createToken(String(userId))
        const res = await request(app).post('/titles?offset=a&length=b').set('Authorization', 'Bearer ' + userToken).send(data)
        expect(res.statusCode).equal(400)
      })
  
})

describe('POST Title', ()=>{
  it('returns status code 201 if title created', async()=>{
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
        name: "reqString", // or like this {type: type , required: boolean}
        points: 10,
    };
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const res = await request(app).post('/titles').set('Authorization', 'Bearer ' + userToken).send(data)
    expect(res.statusCode).equal(201)
  })
})