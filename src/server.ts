import app from './app'
import http from 'http'
import dotenv from 'dotenv'
import { initSocket } from './socket';

dotenv.config()

const PORT = process.env.PORT || 4000;

const server = http.createServer(app)

initSocket(server)

server.listen(PORT,() => {
    console.log(`Server Running on ${PORT}`)
})

