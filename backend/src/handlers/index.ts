import { Request, Response } from 'express'
import slug from 'slug'
import { formidable } from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../model/User"
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import supabase from '../config/supabase'
import fs from 'fs'

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) {
        const error = new Error('El Email ya Esta Registrado')
        return res.status(409).json({ error: error.message, value: 1 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email no válido" });
    }

    req.body.email = email.toLowerCase();

    const handle = slug(req.body.handle, '')
    const handleExist = await User.findOne({ handle })
    if (handleExist) {
        const error = new Error('El Nombre de usuario no esta disponible')
        return res.status(409).json({ error: error.message, value: 2 })
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

    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    //comprobar su password
    const isPasswordCorrect = await checkPassword(password, user.password as string)
    if (!isPasswordCorrect) {
        const error = new Error('Usuario o Contraseña Incorrecta')
        return res.status(401).json({ error: error.message })
    }

    //Generar JWT
    const token = generateJWT({ id: user._id })

    // res.send(`Usuario Verificado - Bienvenido ${user.name}`)
    res.send(token)
}

export const getUserAuthenticated = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body 
        
        const handle = slug(req.body.handle, '')
        const handleExist = await User.findOne({ handle })
        if (handleExist && handleExist.email !== req.user.email) {
            const error = new Error('El Nombre de usuario no esta disponible')
            return res.status(409).json({ error: error.message, value: 2 })
        }

        // Actualizar el perfil del usuario
        req.user.description = description
        req.user.links = links
        req.user.handle = handle

        await req.user.save()
        
        res.send('Perfil actualizado correctamente')
    } catch (e) {
        const error = new Error('Error al actualizar el perfil')
        return res.status(500).json({ error: error.message })  
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })

    form.parse(req, async (error, fields, files) => {
        if (error) {
            return res.status(500).json({ error: 'Error al procesar el archivo' })
        }
        if (!files.file || !files.file[0]) {
            return res.status(400).json({ error: 'No se encontró ningún archivo' })
        }

        try {
            const file = files.file[0]
            const fileBuffer = fs.readFileSync(file.filepath)
            const extension = file.originalFilename?.split('.').pop()
            const fileName = `${uuid()}.${extension}`

            const { data, error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, fileBuffer, {
                    contentType: file.mimetype ?? 'image/jpeg',
                    upsert: false
                })

            if (uploadError) {
                return res.status(500).json({ error: 'Error al subir la imagen' })
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(data.path)

            req.user.image = publicUrl
            await req.user.save()
            res.json({ image: publicUrl })

        } catch (e) {
            console.log('❌ Error:', e)
            res.status(500).json({ error: 'Error al subir la imagen' })
        }
    })
}