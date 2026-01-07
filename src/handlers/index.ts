import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from "../model/User"
import { checkPassword, hashPassword } from '../utils/auth'

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) {
        const error = new Error('El Usuario ya Esta Registrado')
        return res.status(409).json({ error: error.message })
    }

    const handle = slug(req.body.handle, '')
    const handleExist = await User.findOne({ handle })
    if (handleExist) {
        const error = new Error('Nombre no Disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()

    res.status(201).send('Usuario Registrado Correctamente')
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body
    //revisar si el usuario existe
    const user = await User.findOne({ email })
    
    if(!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    //comprobar su password
    const isPasswordCorrect = await checkPassword(password, user.password as string)
    if(!isPasswordCorrect) {
        const error = new Error('Contraseña Incorrecta')
        return res.status(401).json({ error: error.message })
    }

    res.status(200).json({ message: 'Usuario Autenticado Correctamente' })
}