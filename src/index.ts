// const express = require('express')  || CJS Common JS
import express from 'express' // ESM ECMAScript modules

const app = express()

//Routing 
app.get('/', (req,res) => {
    res.send('hola mundo en express / typescript')
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log('servidor activo: ',port)
})