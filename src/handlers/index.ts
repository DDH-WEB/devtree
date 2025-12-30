import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from "../model/User"
import { hashPassword } from '../utils/auth'

export const createAccount = async (req : Request, res:Response) => {
    //Manejo de Errores
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body
    const userExist = await User.findOne({email})
    if (userExist) {
        const error = new Error('El Usuario ya Esta Registrado')
        return res.status(409).json({error : error.message})
    }

    const handle = slug(req.body.handle, '')
    const handleExist = await User.findOne({handle})
    if(handleExist) {
        const error = new Error('Nombre no Disponible')
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle
    
    await user.save()

    res.status(201).send('Usuario Registrado Correctamente')
}