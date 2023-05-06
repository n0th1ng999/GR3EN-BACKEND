const config = require('./config');
const mongoose = require('mongoose')

module.exports = {
  connectToDb : async () => {
    try {
      await mongoose.connect(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true, dbName: config.dbName } )
      console.log('Connected to database:', mongoose.connection.db.databaseName);
     
    } catch (error) {
      console.log(error)
    }
    
}
}
