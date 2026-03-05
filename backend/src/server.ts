// const express = require('express')  || CJS Common JS
import express from 'express' // ESM ECMAScript modules
import cors from 'cors'
import { corsConfig } from './config/cors'
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'

connectDB()

const app = express()

// Cors Policy
app.use(cors(corsConfig))

// Leer datos de Formularios
app.use(express.json())

app.use('/', router)

export default app