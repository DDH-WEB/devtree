// const express = require('express')  || CJS Common JS
import express from 'express' // ESM ECMAScript modules
import router from './router'

const app = express()

// Leer datos de Formularios
app.use(express.json())

app.use('/', router)

export default app