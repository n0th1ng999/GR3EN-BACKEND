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
      idUser :userId,
      fotoOcorrencia: "funciona por favor",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"funciona por favor",
      statusOcorrencia:false
    };

    const userToken = createToken(userId)
    console.log(userToken)
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
      fotoOcorrencia: "PHN2ZyB3aWR0aD0iMTIzIiBoZWlnaHQ9IjIyMiIgdmlld0JveD0iMCAwIDEyMyAyMjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfM18xMzMpIj4KPHBhdGggZD0iTTQuNzQyMTMgOC4xMzA0QzQuNzQyMTMgNC4zNTc0NCA3LjgwMDcyIDEuMjk4ODYgMTEuNTczNyAxLjI5ODg2SDEwMC44MjZDMTA0LjU5OSAxLjI5ODg2IDEwNy42NTcgNC4zNTc0NSAxMDcuNjU3IDguMTMwNDFWMjEuODE4N0MxMDcuNjU3IDI1LjU5MTYgMTA0LjU5OSAyOC42NTAyIDEwMC44MjYgMjguNjUwMkg5NS4xNDg5VjE0LjI3OTJIMTcuMjUwNlYyOC42NTAySDExLjU3MzdDNy44MDA3MiAyOC42NTAyIDQuNzQyMTMgMjUuNTkxNiA0Ljc0MjEzIDIxLjgxODdWOC4xMzA0WiIgZmlsbD0iI0ZGRUVCMCIvPgo8cGF0aCBkPSJNNC43NDIxMyA5Ljg1Mjg0QzQuNzQyMTMgNi4wNzk4OCA3LjgwMDcyIDMuMDIxMyAxMS41NzM3IDMuMDIxM0gxMDAuODI2QzEwNC41OTkgMy4wMjEzIDEwNy42NTcgNi4wNzk4OSAxMDcuNjU3IDkuODUyODVWMjMuNTQxMUMxMDcuNjU3IDI3LjMxNDEgMTA0LjU5OSAzMC4zNzI3IDEwMC44MjYgMzAuMzcyN0g5NS4xNDg5VjE2LjAwMTZIMTcuMjUwNlYzMC4zNzI3SDExLjU3MzdDNy44MDA3MiAzMC4zNzI3IDQuNzQyMTMgMjcuMzE0MSA0Ljc0MjEzIDIzLjU0MTFWOS44NTI4NFoiIGZpbGw9IiNGNENDM0YiLz4KPHBhdGggZD0iTTE3LjI1ODkgMTUuODQxOEg5NS4xNDA3VjcwLjk5NjhMNTYuMTk5OCA5OC4zMTgyTDE3LjI1ODkgNzAuOTk2OFYxNS44NDE4WiIgZmlsbD0iIzI4NzRCQSIvPgo8bWFzayBpZD0ibWFzazBfM18xMzMiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjE3IiB5PSIxNSIgd2lkdGg9Ijc5IiBoZWlnaHQ9Ijg0Ij4KPHBhdGggZD0iTTE3LjQyMzUgMTUuODQxOEg5NS4yNjkzVjcxLjAwNThMNTYuMzQ2NCA5OC4zMTgyTDE3LjQyMzUgNzEuMDA1OFYxNS44NDE4WiIgZmlsbD0iIzI4NzRCQSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfM18xMzMpIj4KPHJlY3QgeD0iNDEuNDM5OCIgeT0iLTE2Ljg5NjIiIHdpZHRoPSIyOS44MTMzIiBoZWlnaHQ9IjExNS4yMTQiIGZpbGw9IiMyRDQwNzEiLz4KPC9nPgo8cmVjdCB4PSI0OS43MDk1IiB5PSI4My44NTk2IiB3aWR0aD0iMTIuNTE2NyIgaGVpZ2h0PSIyMS4zMjQ4IiByeD0iNi4yNTgzNiIgZmlsbD0iI0MwOTUyNSIvPgo8Y2lyY2xlIGN4PSI1NS45Njc5IiBjeT0iMTU1LjE0OCIgcj0iNTQuOTM0NSIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzNfMTMzKSIvPgo8Y2lyY2xlIGN4PSI1NS45Njc5IiBjeT0iMTU1LjE0OCIgcj0iNDIuODgxNCIgZmlsbD0iIzcwNTEwMCIvPgo8bWFzayBpZD0ibWFzazFfM18xMzMiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjE1IiB5PSIxMTciIHdpZHRoPSI4NyIgaGVpZ2h0PSI4NyI+CjxjaXJjbGUgY3g9IjU4LjU2MzkiIGN5PSIxNjAuMDM3IiByPSI0Mi45ODEyIiBmaWxsPSIjQzI4QjM3Ii8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMV8zXzEzMykiPgo8Y2lyY2xlIGN4PSI1NS45Njc5IiBjeT0iMTU1LjE0OCIgcj0iNDIuOTgxMiIgZmlsbD0iI0UzQTUwNCIvPgo8L2c+CjxjaXJjbGUgY3g9IjU2LjU0ODIiIGN5PSIxNTUuNDU3IiByPSIzNS4zMDk5IiBmaWxsPSIjQzE4MjIyIi8+CjxwYXRoIGQ9Ik01Ni41NDgxIDEyNy4wMzdMNjQuODczMiAxNDMuOTc0TDgxLjUyMzQgMTQ2LjA5MUw3MC4wOTAzIDE1OS4xMzNMNzMuMTk4MyAxNzcuODQ4TDU2LjU0ODEgMTY5LjM4TDM5Ljg5NzkgMTc3Ljg0OEw0My4wMzM3IDE1OS4xMzNMMzEuNTcyOCAxNDYuMDkxTDQ4LjIyMyAxNDMuOTc0TDU2LjU0ODEgMTI3LjAzN1oiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8zXzEzMykiLz4KPHBhdGggZD0iTTU2Ljk5NjggMTI2LjgxNkw1Ni41NDgxIDEyNS45MDNMNTYuMDk5NCAxMjYuODE2TDQ3Ljg5MyAxNDMuNTEyTDMxLjUwOTcgMTQ1LjU5NUwzMC41NzU3IDE0NS43MTRMMzEuMTk3MiAxNDYuNDIxTDQyLjUwMTMgMTU5LjI4NEwzOS40MDQ4IDE3Ny43NjZMMzkuMjQxIDE3OC43NDRMNDAuMTI0NiAxNzguMjk0TDU2LjU0ODEgMTY5Ljk0MUw3Mi45NzE2IDE3OC4yOTRMNzMuODUzNyAxNzguNzQzTDczLjY5MTUgMTc3Ljc2N0w3MC42MjIzIDE1OS4yODRMODEuODk5NCAxNDYuNDIxTDgyLjUxOTIgMTQ1LjcxNEw4MS41ODY1IDE0NS41OTVMNjUuMjAzMiAxNDMuNTEyTDU2Ljk5NjggMTI2LjgxNloiIHN0cm9rZT0iI0EzNkQxRCIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIvPgo8cGF0aCBvcGFjaXR5PSIwLjUiIGQ9Ik05NS41MTc4IDUwLjM4ODJMMTcuMTQ3IDUwLjM4ODJMMTcuMTQ3IDE1LjkzOTZMOTUuNTE3OCAxNS45Mzk2TDk1LjUxNzggNTAuMzg4MloiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8zXzEzMykiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzNfMTMzIiB4PSIwLjI0OTg4OCIgeT0iMC41MTUzNjEiIHdpZHRoPSIxMjIuNDA1IiBoZWlnaHQ9IjIyMS4zMiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR4PSI1LjQ4NDQ5IiBkeT0iNS40ODQ0OSIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzLjEzMzk5Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4zIDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfM18xMzMiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfM18xMzMiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zXzEzMyIgeDE9IjU1Ljk2NzkiIHkxPSIxMDAuMjE0IiB4Mj0iNTUuOTY3OSIgeTI9IjIxMC4wODMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRTE3NiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRkQxMkQiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzNfMTMzIiB4MT0iNTYuNTQ4MSIgeTE9IjEyNy4wMzciIHgyPSI1Ni41NDgxIiB5Mj0iMTc3Ljg0OCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjAuMDAwMSIgc3RvcC1jb2xvcj0iI0ZGRkZGRCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRkU4NkQiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzNfMTMzIiB4MT0iNTYuMzMyNCIgeTE9IjUwLjM4ODIiIHgyPSI1Ni4zMzI0IiB5Mj0iMTUuOTM5NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMUQ2MkEyIiBzdG9wLW9wYWNpdHk9IjAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTQyNzVBIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==",
      pontosOcorrencia: 100,
      categoriaOcorrencia:"Partido",
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
  })})
describe("PUT Occurrence", ()=>{

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
    const res = await request(app).put(`/occurrences/${OccID}`).set('Authorization', 'Bearer ' + userToken).send({})
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
