import mongoose from "mongoose"
import  Colors  from "colors"

export const connectDB = async () => {
    try {
        
        const {connection} = await mongoose.connect(process.env.MONGO_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(Colors.magenta.bold(`Conectado en: ${url}`))
    } catch (error) {
        console.log(Colors.bgRed.white.bold(`Error en Conexión: ${error.message}`))
        process.exit(1)
    }
}