import app from './app.js'
import connectDB from './config/database.js'

connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Backend do Cofrinho rodando em http://localhost:${PORT}`)
})

