import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount } from './handlers'

const router = Router()

// Autenticación y Registro
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .trim()
        .withMessage('El Handle no puede ir Vació'),
    createAccount
)

export default router