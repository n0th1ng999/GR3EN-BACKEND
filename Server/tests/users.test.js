  const {app,server} = require('../app')
  const User = require('../models/user.model')
  const request = require('supertest')
  const mongoose = require('mongoose')
  const databaseLink = process.env.MONGODB_URI
  const RealDate = Date.now
  const {decodeToken,verifyToken,createToken} = require('../controllers/Helpers/jwtHelpers')

  const path = require('path');
  const { expect } = require('chai')
const jwtHelpers = require('../controllers/Helpers/jwtHelpers')
const { log } = require('console')
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
  beforeAll(async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
  }) 
  
  beforeEach(async() =>{
    
  })
  
  afterAll( async ()=>{
    
    await mongoose.connection.close()
    await server.close()
  })
  
  let userId 
  
  describe('Create New User', ()=>{

    it('returns status code 201 if user is registered',async () => {
      const data =
      {
        primeiroNome:"test123",
        ultimoNome:"test123",
        email:"test123@mail.com",
        password:"test123",
        escola:"ESMAD"
    } 
      
      
      const res = await request(app).post('/users').send(data)
      expect(res.statusCode).equal(201)
      expect(res.body.token)

      userId = decodeToken(res.body.Token)  
    })
    
    
  })

  describe('Delete User', () => {
     
    it('returns status code 204 if user is removed',async () => {
       
      const res = await request(app).delete('/users/' + userId.id ).set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NzY3NjgyNTI5ZTkwM2QzMjI4ZWNjNCIsImlhdCI6MTY4NTQ4NTUzOCwiZXhwIjoxNjg2MDkwMzM4fQ.5EAHlWJ8H4wano8dEvkq1YfxvBLAHHbAjAyVfF9ZN2g' )
      
      expect(res.statusCode).equal(204)

    })
    
  })