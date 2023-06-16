const jwt = require('jsonwebtoken')
const config = require('../../config')

module.exports = {
    createToken: (id)=>{
        return jwt.sign({id}, config.jwtSecret, {
            expiresIn: config.jwtMaxAge,
        })
    },
    verifyToken: (token)=>{
        try {
            const result = jwt.verify(token,config.jwtSecret)
            return  result
        } catch (error) {
            return false
        }
    },
    decodeToken: (token)=>{
        try {
            return  jwt.decode(token,config.jwtSecret)
        } catch (error) {
            return false
        }
    }
}