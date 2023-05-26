const mongoose = require('mongoose');
const YourModel  = require('../models/user.model'); // Replace 'YourModel' with the actual model name

describe('Mongoose Database Tests', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect('mongodb+srv://tiagogabrielpereira:JmwFU84ZIs8AWgaS@cluster0.csg1iiw.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the database~
    await YourModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the test database before each test
    await YourModel.deleteMany({});
  });

  test('should create a new document', async () => {
    const data = {primeiroNome: 'John', ultimoNome:"Pais", escola:"ESMAD", email:"example@gmail.com",
    password:"mypass",conselhoEco:false,verifierEco:false};
    const createdDocument = await YourModel.create(data);
    console.log(createdDocument);
    expect(createdDocument).toBeDefined();
    expect(createdDocument).toMatchObject(data);
  });

  test('should retrieve documents', async () => {
    // Insert test documents
    const testData = [
      {primeiroNome: 'John', ultimoNome:"Pais", escola:"ESMAD", email:"example@gmail.com",
    password:"mypass",conselhoEco:false,verifierEco:false}
      // Add more test documents as needed
    ];
    await YourModel.insertMany(testData);

    // Retrieve documents
    const documents = await YourModel.find();

    expect(documents.length).toBe(testData.length);
  });

  // Add more test cases as needed
});
