const {app,server} = require('../app')
const User = require('../models/user.model')
const Activity = require('../models/activity.model')
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
    await Activity.deleteMany({})
    await User.deleteMany({})
})

afterAll( async ()=>{
    await Activity.deleteMany({})
    await User.deleteMany({})
    await mongoose.connection.close()
    await server.close()
})

let userId
  describe('Create new activity', ()=>{

    it('returns status code 201 if activities is created', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          imagemAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const res = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      expect(res.statusCode).equal(201);
    });
    it('returns status code 400 if fields are missing', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const res = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      expect(res.statusCode).equal(400);
    });
    it('returns status code 401 if invalid auth key', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const res = await request(app).post('/activities').send(data);
      expect(res.statusCode).equal(401);
    });
    it('returns status code 403 if invalid auth key', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
      const res = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      expect(res.statusCode).equal(403);
    });
  })

  describe('Get activities', ()=>{
    it('returns status code 200 if request is sucessfull', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          imagemAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      const res = await request(app).get('/activities')
      expect(res.statusCode).equal(200);
  })
    it('returns status code 200 if correct query use', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          imagemAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      const res = await request(app).get('/activities?offset=0&length=2')
      expect(res.statusCode).equal(200);
  })
    it('returns status code 400 if incorrect query use', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          imagemAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      const res = await request(app).get('/activities?offset=0')
      expect(res.statusCode).equal(400);
  })
    it('returns status code 400 if incorrect query use, only numbers allowed', async()=>{
      const data ={
          participantesAtividadeNaoExecutado: [],
          participantesAtividadeExecutado: [],
          nomeAtividade:"asdf", 
          descAtividade: "reqString",
          imagemAtividade: "reqString",
          dataHoraAtividade: Date.now(),
          localAtividade: "reqString",
          pontosAtividade: 1,
          statusAtividade: false,
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
          verifierEco: false, 
          pontos:0,
        }
      const userCreate = await request(app).post('/users').send(user)
      userId = decodeToken(userCreate.body.Token).id 
      const userToken = createToken(userId) 
      const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
      const res = await request(app).get('/activities?offset=a&length=b')
      expect(res.statusCode).equal(400);
  })
})


describe('Edit activities', ()=>{
  it('returns status code 200 if activity is changed', async()=>{
    const data ={
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"asdf", 
        descAtividade: "reqString",
        imagemAtividade: "reqString",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqString",
        pontosAtividade: 1,
        statusAtividade: false,
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
        verifierEco: false, 
        pontos:0,
      }
      const changes =
      {
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"changed", 
        descAtividade: "reqStringChanged",
        imagemAtividade: "reqStringChanged",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqStringChanged",
        pontosAtividade: 1,
        statusAtividade: true,
      }
    const userCreate = await request(app).post('/users').send(user)
    userId = decodeToken(userCreate.body.Token).id 
    const userToken = createToken(userId) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = createAtt.body._id
    const res = await request(app).put('/activities/'+attId).set('Authorization', 'Bearer ' + userToken).send(changes);
    expect(res.statusCode).equal(201);
})
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"asdf", 
        descAtividade: "reqString",
        imagemAtividade: "reqString",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqString",
        pontosAtividade: 1,
        statusAtividade: false,
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
        verifierEco: false, 
        pontos:0,
      }
      const changes =
      {
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"changed", 
        descAtividade: "reqStringChanged",
        imagemAtividade: "reqStringChanged",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqStringChanged",
        pontosAtividade: 1,
        statusAtividade: true,
      }
    const userCreate = await request(app).post('/users').send(user)
    userId = decodeToken(userCreate.body.Token).id 
    const userToken = createToken(userId) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = createAtt.body._id
    const res = await request(app).put('/activities/'+attId).send(changes);
    expect(res.statusCode).equal(401);
})
  it('returns status code 403 if not allowed', async()=>{
    const data ={
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"asdf", 
        descAtividade: "reqString",
        imagemAtividade: "reqString",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqString",
        pontosAtividade: 1,
        statusAtividade: false,
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
        verifierEco: false, 
        pontos:0,
      }
      const user2=
      {
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
      const changes =
      {
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"changed", 
        descAtividade: "reqStringChanged",
        imagemAtividade: "reqStringChanged",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqStringChanged",
        pontosAtividade: 1,
        statusAtividade: true,
      }
    const userCreate = await request(app).post('/users').send(user)
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = createAtt.body._id
    const res = await request(app).put('/activities/'+attId).set('Authorization', 'Bearer ' + userToken2).send(changes);
    expect(res.statusCode).equal(403);
})
  
})

describe('Delete Activities', ()=>{
  it('returns status code 204 if activity is deleted', async()=>{
    const data ={
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"asdf", 
        descAtividade: "reqString",
        imagemAtividade: "reqString",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqString",
        pontosAtividade: 1,
        statusAtividade: false,
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
        verifierEco: false, 
        pontos:0,
      }
      const changes =
      {
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"changed", 
        descAtividade: "reqStringChanged",
        imagemAtividade: "reqStringChanged",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqStringChanged",
        pontosAtividade: 1,
        statusAtividade: true,
      }
    const userCreate = await request(app).post('/users').send(user)
    userId = decodeToken(userCreate.body.Token).id 
    const userToken = createToken(userId) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = createAtt.body._id
    const res = await request(app).delete('/activities/'+attId).set('Authorization', 'Bearer ' + userToken);
    expect(res.statusCode).equal(204);
})
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"asdf", 
        descAtividade: "reqString",
        imagemAtividade: "reqString",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqString",
        pontosAtividade: 1,
        statusAtividade: false,
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
        verifierEco: false, 
        pontos:0,
      }
      const changes =
      {
        participantesAtividadeNaoExecutado: [],
        participantesAtividadeExecutado: [],
        nomeAtividade:"changed", 
        descAtividade: "reqStringChanged",
        imagemAtividade: "reqStringChanged",
        dataHoraAtividade: Date.now(),
        localAtividade: "reqStringChanged",
        pontosAtividade: 1,
        statusAtividade: true,
      }
    const userCreate = await request(app).post('/users').send(user)
    userId = decodeToken(userCreate.body.Token).id 
    const userToken = createToken(userId) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = createAtt.body._id
    const res = await request(app).delete('/activities/'+attId);
    expect(res.statusCode).equal(401);
})
it('returns status code 403 if not allowed', async()=>{
  const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
      verifierEco: false, 
      pontos:0,
    }
    const user2=
    {
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
    const changes =
    {
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"changed", 
      descAtividade: "reqStringChanged",
      imagemAtividade: "reqStringChanged",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqStringChanged",
      pontosAtividade: 1,
      statusAtividade: true,
    }
  const userCreate = await request(app).post('/users').send(user)
  const userCreate2 = await request(app).post('/users').send(user2)
  userId = decodeToken(userCreate.body.Token).id 
  userId2 = decodeToken(userCreate2.body.Token).id 
  const userToken = createToken(userId) 
  const userToken2 = createToken(userId2) 
  const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
  const attId = createAtt.body._id
  const res = await request(app).delete('/activities/'+attId).set('Authorization', 'Bearer ' + userToken2).send(changes);
  expect(res.statusCode).equal(403);
})
})

describe('ADD Users in Activities', ()=>{
  it('returns status code 200 if changed', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).post('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken).send({user:userId});
    expect(res.statusCode).equal(201);
  })
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).post('/activities/'+attId +'/users/' + userId).send({user:userId});
    expect(res.statusCode).equal(401);
  })
  it('returns status code 404 if activity not found', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = ""
    const res = await request(app).post('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken).send({user:userId});
    expect(res.statusCode).equal(404);
  })
  
})
/*  */
describe('Delete users from activity', ()=>{
  it('returns status code 204 if removed', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).delete('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken).send({user:userId});
    expect(res.statusCode).equal(204);
  })
  it('returns status code 400 fields missing', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).delete('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken).send()
    expect(res.statusCode).equal(400);
  })
  it('returns status code 401 if invalid auth key', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).delete('/activities/'+attId +'/users/' + userId).send()
    expect(res.statusCode).equal(401);
  })
  it('returns status code 403 if auth key deosnt match', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = (createAtt.body._id)
    const res = await request(app).delete('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken2).send()
    expect(res.statusCode).equal(403);
  })
  it('returns status code 404 if not found', async()=>{
    const data ={
      participantesAtividadeNaoExecutado: [],
      participantesAtividadeExecutado: [],
      nomeAtividade:"asdf", 
      descAtividade: "reqString",
      imagemAtividade: "reqString",
      dataHoraAtividade: Date.now(),
      localAtividade: "reqString",
      pontosAtividade: 1,
      statusAtividade: false,
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
    const user2=
    {
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
    const userCreate = await request(app).post('/users').send(user)  
    const userCreate2 = await request(app).post('/users').send(user2)
    userId = decodeToken(userCreate.body.Token).id 
    userId2 = decodeToken(userCreate2.body.Token).id 
    const userToken = createToken(userId) 
    const userToken2 = createToken(userId2) 
    const createAtt = await request(app).post('/activities').set('Authorization', 'Bearer ' + userToken).send(data);
    const attId = ""
    const res = await request(app).delete('/activities/'+attId +'/users/' + userId).set('Authorization', 'Bearer ' + userToken).send()
    expect(res.statusCode).equal(404);
  })
})