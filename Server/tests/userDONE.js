const {app,server} = require('../app')
const User = require('../models/user.model')
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
    await User.deleteMany({})
})

afterAll( async ()=>{
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
})

let userId, userId2 

describe('Create New User', ()=>{
    it('returns status code 201 if user is created', async()=>{
        const data =
        {
          primeiroNome:"test",
          ultimoNome:"test",
          escola:"ESMAD",
          email:"test@mail.com",
          password:"test",
          idBadge: [], 
          idTitulo: [], 
          conselhoEco: true, 
          verifierEco: true, 
          pontos:0,
        }
      const res = await request(app).post('/users').send(data)
      expect(res.statusCode).equal(201)
      expect(res.body.token)
      userId = decodeToken(res.body.Token).id
    })


    it('returns status code 400 if user already exists', async()=>{
        const data =
        {
          primeiroNome:"test",
          ultimoNome:"test",
          escola:"ESMAD",
          email:"test@mail.com",
          password:"test",
          idBadge: [], 
          idTitulo: [], 
          conselhoEco: true, 
          verifierEco: true, 
          pontos:0,
        }
        await User.create(data)
        const res =  await request(app).post('/users').send(data)
        expect(res.statusCode).equal(400)
    })
    

})

describe('Delete User', ()=>{
  it('returns status code 204 if user is removed', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const data2 ={
      primeiroNome:"test2",
      ultimoNome:"test2",
      escola:"ESMAD2",
      email:"test2@mail.com",
      password:"test2",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    await User.create(data2)
    const res = await request(app).post('/users').send(data)
    userId = decodeToken(res.body.Token).id
    const AdminToken = createToken(String(userId))
    const res2 = await request(app).delete('/users/' + userId ).set('Authorization', 'Bearer ' + AdminToken)
    expect(res2.statusCode).equal(204)
  })
  
  it('returns status code 401 if invalid auth key', async()=>{

    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const res = await request(app).post('/users').send(data)
    userId = decodeToken(res.body.Token).id
    const res2 = await request(app).delete('/users/' +userId)
    expect(res2.statusCode).equal(401)
  })

  it('returns status code 403 if auth key doesnt match', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const data2 ={
      primeiroNome:"test2",
      ultimoNome:"test2",
      escola:"ESMAD2",
      email:"test2@mail.com",
      password:"test2",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }

    const res1 = await request(app).post('/users').send(data)
    const res2 = await request(app).post('/users').send(data2)
    userId = decodeToken(res1.body.Token).id
    userId2 = decodeToken(res2.body.Token).id
    const sameUserToken = createToken(String(userId2))
    
    const resFinal1 = await request(app).delete('/users/' +userId).set('Authorization', 'Bearer ' + sameUserToken)
    expect(resFinal1.statusCode).equal(403) 

  })




    
}) 



describe('Get Users', ()=>{
  it('returns status code 200', async()=>{
      const data =
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
      const userData = 
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
      const createUser = await request(app).post('/users').send(userData)
      userId = decodeToken(createUser.body.Token).id
      const AdminToken = createToken(userId)
      const res = await request(app).get('/users').set('Authorization', 'Bearer ' + AdminToken)
      expect(res.statusCode).equal(200)
  })

  it('returns status code 200 if correct query use', async()=>{
    const data =
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
      const userData = 
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
      const createUser = await request(app).post('/users').send(userData)
      userId = decodeToken(createUser.body.Token).id
      const AdminToken = createToken(userId)
      const res = await request(app).get('/users?offset=0&length=10').set('Authorization', 'Bearer ' + AdminToken)
      expect(res.statusCode).equal(200)
  })

  it('returns status code 400 if incorrect query', async()=>{
    const data =
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
    const userData = 
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
    const createUser = await request(app).post('/users').send(userData)
    userId = decodeToken(createUser.body.Token).id
    const AdminToken = createToken(userId)
      const res = await request(app).get('/users?offset=1').set('Authorization', 'Bearer ' + AdminToken)
      expect(res.statusCode).equal(400)
  })
  
  it('returns status code 400 if incorrect query(only numbers allowed)', async()=>{
    const data =
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
    const userData = 
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
    const createUser = await request(app).post('/users').send(userData)
    userId = decodeToken(createUser.body.Token).id
    const AdminToken = createToken(userId)
    const res = await request(app).get('/users?offset=a&length=b').set('Authorization', 'Bearer ' + AdminToken)
    expect(res.statusCode).equal(400)
  })

  it('returns status code 200 if search by id with auth', async()=>{
    const data =
      {
        primeiroNome:"test",
        ultimoNome:"test",
        escola:"ESMAD",
        email:"test@mail.com",
        password:"test",
        idBadge: [], 
        idTitulo: [], 
        conselhoEco: true, 
        verifierEco: true, 
        pontos:0,
      }
    const res = await request(app).post('/users').send(data)
    userId = decodeToken(res.body.Token).id
    const sameUserToken = createToken(String(userId))

    const res2 = await request(app).get('/users/' +userId).set('Authorization', 'Bearer ' + sameUserToken)
    expect(res2.statusCode).equal(200)
  })

  it('return status code 401 if invalid auth key', async()=>{
    const data =
      {
        primeiroNome:"test",
        ultimoNome:"test",
        escola:"ESMAD",
        email:"test@mail.com",
        password:"test",
        idBadge: [], 
        idTitulo: [], 
        conselhoEco: true, 
        verifierEco: true, 
        pontos:0,
      }
      const res = await request(app).post('/users').send(data)
      userId = decodeToken(res.body.Token).id
      const res2 = await request(app).get('/users/' +userId)
      expect(res2.statusCode).equal(401)
  })

  it('return status code 403 if auth key doesnt match', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: true, 
      verifierEco: true, 
      pontos:0,
    }
    const data2 =
      {
        primeiroNome:"test2",
        ultimoNome:"test2",
        escola:"ESMAD",
        email:"test2@mail.com",
        password:"test",
        idBadge: [], 
        idTitulo: [], 
        conselhoEco: true, 
        verifierEco: true, 
        pontos:0,
      }
    const res1 = await request(app).post('/users').send(data)
    const res2 = await request(app).post('/users').send(data2)
    userId = decodeToken(res1.body.Token).id
    userId2 = decodeToken(res2.body.Token).id
    const sameUserToken = createToken(String(userId))
    const sameUserToken2 = createToken(String(userId2))
    
    const resFinal1 = await request(app).get('/users/' +userId).set('Authorization', 'Bearer ' + sameUserToken2)
    const resFinal2 = await request(app).get('/users/' +userId2).set('Authorization', 'Bearer ' + sameUserToken)
    expect(resFinal1.statusCode).equal(403) 
    expect(resFinal2.statusCode).equal(403) 
  })

})

describe('Edit Users', ()=>{
  it('return status code 201 if sucessfully changed', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const changes ={
      primeiroNome:"testChanged"
    }
    const res1 = await request(app).post('/users').send(data)
    userId = decodeToken(res1.body.Token).id
    const sameUserToken = createToken(String(userId))
    const res = await request(app).put('/users/' + userId).set('Authorization', 'Bearer ' + sameUserToken).send(changes)
    expect(res.statusCode).equal(201)
  })  

  it('returns status code 401 if invalid auth key', async() =>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const changes ={
      primeiroNome:"testChanged"
    }
    const res1 = await request(app).post('/users').send(data)
    userId = decodeToken(res1.body.Token).id
    const res = await request(app).put('/users/' + userId).send(changes)
    expect(res.statusCode).equal(401)
  })
  
  it('returns status code 409 if auth key doesnt match', async() =>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const data2 =
    {
      primeiroNome:"test2",
      ultimoNome:"test2",
      escola:"ESMAD2",
      email:"test2@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    
    const changes ={
      primeiroNome:"testChanged"
    }
    const res1 = await request(app).post('/users').send(data)
    userId = decodeToken(res1.body.Token).id
    const res2 = await request(app).post('/users').send(data2)
    userId2 = decodeToken(res2.body.Token).id

    const sameUserToken = createToken(String(userId2))
    const res = await request(app).put('/users/' + userId).set('Authorization', 'Bearer ' + sameUserToken).send(changes)
    
    expect(res.statusCode).equal(403)
  })

})

describe('Login User', ()=>{
  it('returns status code 200 if login is successfull', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const data2={
      email:"test@mail.com",
      password:"test",
    }
    
    const res1 = await request(app).post('/users').send(data)
    const res = await request(app).get('/users/login').send(data2)
    expect(res.statusCode).equal(200)
  })


  it('returns status code 401 if wrong email or password', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }
    const data2={
      email:"test111@mail.com",
      password:"test1",
    }
    const res1 = await request(app).post('/users').send(data)
    const res = await request(app).get('/users/login').send({
      email:"test@mail.com",
      password:"test1",
    })
    const res2 = await request(app).get('/users/login').send({
      email:"test111@mail.com",
      password:"test",
    })
    
    expect(res.statusCode).equal(401)
    expect(res2.statusCode).equal(401)
  })

  it('returns status code 400 if there is any field missing', async()=>{
    const data =
    {
      primeiroNome:"test",
      ultimoNome:"test",
      escola:"ESMAD",
      email:"test@mail.com",
      password:"test",
      idBadge: [], 
      idTitulo: [], 
      conselhoEco: false, 
      verifierEco: false, 
      pontos:0,
    }

    const res1 = await request(app).post('/users').send(data)
    const res = await request(app).get('/users/login').send({
      email:"test@mail.com",
    })
    const res2 = await request(app).get('/users/login').send({
      password:"test",
    })

    expect(res.statusCode).equal(400)
    expect(res2.statusCode).equal(400)
    
  })


  
})