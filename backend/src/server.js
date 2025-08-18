import app from './app.js'
import connectDB from './config/database.js'
import checkRecurringExpensesJob from './jobs/checkRecurringExpensesJob.js'

connectDB()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Backend do Cofrinho rodando em http://localhost:${PORT}`)
    
    checkRecurringExpensesJob();
})

