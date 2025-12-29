// const express = require('express')  || CJS Common JS
import express from 'express' // ESM ECMAScript modules
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'

const app = express()

connectDB()

// Leer datos de Formularios
app.use(express.json())

app.use('/', router)

export default app