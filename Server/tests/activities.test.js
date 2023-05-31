  const {app,server} = require('../app')
  const Activity = require('../models/activity.model')
  const request = require('supertest')
  const mongoose = require('mongoose')
  const databaseLink = process.env.MONGODB_URI
  const RealDate = Date.now

  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
  beforeAll(async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
  }) 
  
  beforeEach(async() =>{
    await Activity.deleteMany({})
  })
  
  afterAll( async ()=>{
    await Activity.deleteMany({})
    await mongoose.connection.close()
    await server.close()
  })

  
  describe('Create new activity', ()=>{

    it.todo('returns status code 201 if activity is created')
    
    it.todo('returns status code 400 if fields are missing')

    it.todo('returns status code 400 if fields are missing')

    it.todo('returns status code 400 if fields are missing')

  })