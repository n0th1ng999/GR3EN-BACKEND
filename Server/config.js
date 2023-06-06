    const path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, '.env') })

    const config = {
        
        //DB URL
        //tiagogabrielpereira
        //password JmwFU84ZIs8AWgaS
        databaseURL: process.env.MONGODB_URI,

        //LOCALHOST 
        hostname : process.env.HOST || '127.0.0.1',
        
        //PORTA  
        port : process.env.PORT || 3000,

        dbName:  process.env.Database,

        //JWT stuff 
        //SECRET
        jwtSecret: process.env.jwtSecret,
        //Max Age for the token in seconds
        jwtMaxAge: 60 * 60 * 24 * 7 // Sete dias

    }   


    
module.exports = config
