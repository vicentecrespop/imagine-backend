import 'dotenv/config'

import express from "express"
import jwt from 'jsonwebtoken'
import multer from 'multer'
import crypto from 'crypto'
import { extname } from 'path'

import { authMiddleware } from './middlewares/authMiddleware.js'
import { UserService } from "./services/user-services.js"
import { ProductService } from './services/product-services.js'

const app = express()
const port = 3000
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const newFileName = crypto.randomBytes(32).toString('hex')
        const fileExtension = extname(file.originalname)
        cb(null, `${newFileName}${fileExtension}`)
    }
})
const uploadMiddleware = multer({ storage })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    
    res.send('ImagineShop')
})

app.post('/login', async (req, res) => {
    const { email, password }  = req.body
    const userService = new UserService()
    const login = await userService.login(email, password)
    if(login) {
        const secretKey = process.env.SECRET_KEY
        const token = jwt.sign({user: login}, secretKey, { expiresIn: '1d' })
        return res.status(200).json({ token })
    }
    return res.status(400).json({ error: 'E-mail ou senha inválidos!' })
})

app.post('/users', async (req, res) => {

    const { name, email, password } = req.body
    const user = {name, email, password}
    const userService = new UserService()
    await userService.create(user)

    return res.status(201).json({msg: 'Usuário criado com sucesso!!'})
})

app.get('/products', async (req, res) => {
    const productService = new ProductService()
    const products = await productService.findAll()
    return res.status(200).json(products)
})

app.get('/products/:id', async (req, res) => {

    const id = req.params.id
    const productService = new ProductService()
    const product = await productService.findById(id)
    if(product) {
        return res.status(200).json(product)
    }

    return res.status(404).json({error: 'Produto não encontrado.'})
})

app.use('/uploads', express.static('uploads'))
app.use(authMiddleware)


app.get('/users', async (req, res) => {

    const userService = new UserService()
    const users = await userService.findAll()

    return res.status(200).json(users)
})

app.get('/users/:id', authMiddleware, async (req, res) => {

    const id = req.params.id
    const userService = new UserService()
    const user = await userService.findById(id)
    if(user) {
        return res.status(200).json(user)
    }

    return res.status(404).json({error: 'Usuário não encontrado.'})
})

app.delete('/users/:id', async (req, res) => {
    const id = req.params.id
    const userService = new UserService()
    const user = await userService.find(id)
    if(user) {
        await userService.delete(id)
        return res.status(200).json({msg: 'Usuário deletado com sucesso!'})
    }
    return res.status(404).json({ error: 'Usuário não encontrado!' })
})

app.put('/users/:id', async (req, res) => {
    const id = req.params.id
    const { name, email, password } = req.body
    const updatedUser = {name, email, password}
    const userService = new UserService()
    const user = await userService.find(id)
    if(user) {
        await userService.update(id, updatedUser)
        return res.status(200).json({ msg: 'Usuário atualizado com sucesso!' })
    }
    return res.status(404).json({ error: 'Usuário não encontrado.' })
})

app.post('/products', uploadMiddleware.single('image'), async (req, res) => {
    const { name, description, price, summary, stock } = req.body
    const filename = req.file.filename
    const product = {name, description, price, summary, stock, filename}
    const productService = new ProductService()
    await productService.create(product)

    return res.status(201).json({msg: 'Produto cadastrado com sucesso!!'})

})

app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}...`)
})