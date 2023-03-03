import jwt from 'jsonwebtoken'
import { UserService } from '../services/user-services.js'

export const authMiddleware = (req, res, next) => {
    
    const authorization = req.headers.authorization
    const token = authorization ? authorization.split(' ')[1] : undefined
    if(!token) {
        return res.status(401).json({ error: "Sem autorização, faça o login."})
    }
    
    const secretKey = process.env.SECRET_KEY
    jwt.verify(token, secretKey, {ignoreExpiration: false}, async (err, decodedToken) => {
        if(err) {
            console.log(err)
            return res.status(401).json({ error: "Aconteceu um erro ao logar no sistema." })
        }

        const isValidToken = decodedToken && decodedToken.user
        if(!isValidToken) {
            return res.status(401).json({ error: "Aconteceu um erro ao logar no sistema." })
        }
        
        const userService = new UserService()
        const user = await userService.findByEmail(decodedToken.user.email)
        if(user) {
            return next()
        }
        
    })
    

    
}