import colors from 'colors'
import server from './server'

const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(colors.blue.italic.bold(`servidor activo en el puerto: ${port}`))
})