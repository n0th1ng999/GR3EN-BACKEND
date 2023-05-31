  const {app,server} = require('../app')
  const Occurrence = require('../models/occurrence.model')
  const request = require('supertest')
  const mongoose = require('mongoose')
  const databaseLink= process.env.MONGODB_URI
  const RealDate = Date.now

  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

  
  beforeAll(async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
  }) 
  
  beforeEach(async() =>{
    await Occurrence.deleteMany({})
  })
  
  afterAll( async ()=>{
    await Occurrence.deleteMany({})
    await mongoose.connection.close()
    await server.close()
  })

  
  describe('creating new occurrence', ()=>{
    it('returns status code 201 if occurrence is created', async()=>{
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
      expect(res.statusCode).toEqual(201);
    
    })
    
    it('returns status code 400 if fields are missing', async()=>{
      const data ={
        descricaoOcorrencia: "funciona por favor",
        localOcorrencia: "funciona por favor",
        dataOcorrencia: Date.now(),
        idUser : 1,
        fotoOcorrencia: "funciona por favor",
        pontosOcorrencia: 100,
        categoriaOcorrencia:"funciona por favor",
        statusOcorrencia:false
      };
      const res = await request(app).post('/occurrences').send(data);
      expect(res.statusCode).toEqual(400);
    })
    
    
  })