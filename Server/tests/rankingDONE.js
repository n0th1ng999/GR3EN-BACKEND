const {app,server} = require('../app')
const User = require('../models/user.model')
const Ranking = require('../models/ranking.model')
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
    await Ranking.deleteMany({})
    await User.deleteMany({})
})

afterAll( async ()=>{
    await Ranking.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
})

describe('GET Ranking', ()=>{
  it('returns status code 200 if successfull request', async()=>{
    const data =
    {
      year:2022,
      users:[]
    };
    const createRanking = await request(app).post('/rankings')
    const res = await request(app).get('/rankings')
    expect(res.statusCode).equal(200)
  })
  it('returns status code 200 if successfull request', async()=>{
    const data =
    {
      year:2022,
      users:[]
    };
    const createRanking = await request(app).post('/rankings')
    const res = await request(app).get('/rankings?offset=1&length=2')
    expect(res.statusCode).equal(200)
  })
  it('returns status code 400 if incorrect query use', async()=>{
    const data =
    {
      year:2022,
      users:[]
    };
    const createRanking = await request(app).post('/rankings')
    const res = await request(app).get('/rankings?offset=1')
    expect(res.statusCode).equal(400)
  })
  it('returns status code 400 if incorrect query use', async()=>{
    const data =
    {
      year:2022,
      users:[]
    };
    const createRanking = await request(app).post('/rankings')
    const res = await request(app).get('/rankings?offset=a&length=b')
    expect(res.statusCode).equal(400)
  })


  
})

describe('POST Ranking', ()=>{
  it('returns status code 201 if ranking created', async()=>{
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
      year:2022,
      users:[]
    };
    const createUser = await request(app).post('/users').send(user)
    userId=decodeToken(createUser.body.Token).id
    const userToken = createToken(String(userId))
    const createRanking = await request(app).post('/rankings')
    const res = await request(app).post('/rankings').send(data)
    expect(res.statusCode).equal(201)
  })
})