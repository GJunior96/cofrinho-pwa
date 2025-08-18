import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
//import rotasPrincipais  from './routes/index.js'
import { tratarErroPadrao } from './middlewares/errorHandler.js'
import authRoutes from './modules/auth/routes/AuthRoutes.js'
import userRoutes from './modules/users/routes/UserRoutes.js'
import accountRoutes from './modules/accounts/routes/AccountRoutes.js'
import goalRoutes from './modules/goals/routes/GoalRoutes.js'
import reportRoutes from './modules/reports/routes/ReportRoutes.js'
import recurringExpensesRoutes from './modules/recurringExpenses/routes/RecurringExpenseRoutes.js'
import categoryRoutes from './modules/categories/routes/CategoryRoutes.js'
import errorHandler from './shared/middlewares/errorHandler.js'

dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())
//app.use('/api', rotasPrincipais)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/accounts', accountRoutes)
app.use('/goals', goalRoutes)
app.use('/recurring-expenses', recurringExpensesRoutes)
app.use('/reports', reportRoutes)
app.use('/categories', categoryRoutes)

app.use(errorHandler)

export default app

