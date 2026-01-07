import { Router, type RequestHandler } from 'express'
import { body } from 'express-validator'
import { createAccount, login } from './handlers'
import { handleInputErrors } from './middleware/validation'

const router = Router()

// Autenticación y Registro
router.post('/auth/register',
    body('handle')
        .notEmpty()
        .trim()
        .withMessage('El Handle no puede ir Vació'),
    body('name')
        .notEmpty()
        .trim()
        .withMessage('El Nombre no puede ir Vació'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('El Email no es válido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('La Contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    createAccount
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('El Email no es válido'),
    body('password')
        .notEmpty()
        .withMessage('La Contraseña es Obligatoria'),
    handleInputErrors,
    login
)
export default router