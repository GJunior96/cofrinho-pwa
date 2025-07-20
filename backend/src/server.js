import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rotasPrincipais  from './routes/index.js'
import { tratarErroPadrao } from './middlewares/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api', rotasPrincipais)

app.listen(PORT, () => {
    console.log(`🚀 Backend do Cofrinho rodando em http://localhost:${PORT}`)
})

app.use(tratarErroPadrao)