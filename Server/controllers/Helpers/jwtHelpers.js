const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = {
    createToken : (id)=>{
        return jwt.sign({id}, config.jwtSecret, {
            expiresIn: config.jwtMaxAge,
        })
    },
    verifyToken:(token)=>{
        return jwt.verify(token,config.jwtSecret)
    },
    decodeToken:(token)=>{
        return jwt.decode(token,config.jwtSecret)
    }
}