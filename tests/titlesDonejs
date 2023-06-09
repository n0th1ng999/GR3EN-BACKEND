const {app,server} = require('../app')
const User = require('../models/user.model')
const Title = require('../models/title.model')
const request = require('supertest')
const mongoose = require('mongoose')
const {decodeToken,verifyToken,createToken} = require('../controllers/Helpers/jwtHelpers')
const {expect, test} = require('@jest/globals');

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
beforeAll(async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
  }) 
  
  beforeEach(async() =>{
    
  })
  
  afterEach(async() => {
  await User.deleteMany({})
  await Title.deleteMany({})
  
})

afterAll( async ()=>{
    await mongoose.connection.close()
    await server.close()
})

const user =
    {
      primeiroNome:"admin",
      ultimoNome:"admin",
      escola:"ESMAD",
      email:"admin@mail.com",
      password:"admin",
      conselhoEco: true, 
    }

const userFail =
    {
      primeiroNome:"admin",
      ultimoNome:"admin",
      escola:"ESMAD",
      email:"admin@mail.com",
      password:"admin", 
    }

    const data =
    {
      name:"badge Activity",
      points:100,
      type:"ActivityCounter",
      requirement:1
    }

    const dataFail =
    {
      points:100,
      type:"ActivityCounter",
      requirement:1
    }


describe('POST titles', ()=>{

  it('returns status code 201 if correct query use', async()=>{
      let res = await request(app).post('/users').send(user)
      const userToken = res.body.Token
      res = await request(app).post('/titles').set('Authorization', 'Bearer ' + userToken).send(data);
      
      expect(res.statusCode).toBe(201)
    })
    
    it('returns status code 400 if fields are missing', async()=>{
      let res = await request(app).post('/users').send(user)
      const userToken = res.body.Token
      res = await request(app).post('/titles').set('Authorization', 'Bearer ' + userToken).send(dataFail);
      
      expect(res.statusCode).toBe(400)
    })
    
    it('returns status code 401 if user is not authenticated', async()=>{
      let res = await request(app).post('/users').send(user)
      const userToken = res.body.Token
      res = await request(app).post('/titles').send(data);
      
      expect(res.statusCode).toBe(401)
    })
    
    it('returns status code 403 if user is not admin', async()=>{
      let res = await request(app).post('/users').send(userFail)
      const userToken = res.body.Token
      res = await request(app).post('/titles').set('Authorization', 'Bearer ' + userToken).send(data);
      
      expect(res.statusCode).toBe(403)
    })
      
    })
  
  
describe('GET titles', ()=>{
    it('returns status code 200', async()=>{
        let titles = await request(app).get('/titles')
        
        expect(titles.statusCode).toBe(200)
      })

    it('returns status code 206 if correct query use (offset or length)', async()=>{
        let titles = await request(app).get('/titles?offset=1&length=10')
        
        expect(titles.statusCode).toBe(206)
      })

    it('returns status code 206 if correct query use (titles)', async()=>{
        let titles = await request(app).get('/titles?titles=6482341829fcafe9aae7b788')
        
        expect(titles.statusCode).toBe(206)
      })
      
    it('returns status code 400 if incorrect query use (offset or length missing) ', async()=>{
        let titles = await request(app).get('/titles?offset=1')
        
        expect(titles.statusCode).toBe(400)
      })
      
    it('returns status code 400 if incorrect query use (Only numbers are allowed) ', async()=>{
        let titles = await request(app).get('/titles?titles=a')
        
        expect(titles.statusCode).toBe(400)
      })
      
    })  