import express from 'express'
import request from 'supertest'
import routes from '../../src/routes/index.js'
import { tratarErroPadrao } from '../../src/middlewares/errorHandler.js'

export function setupAppTests({ beforeRoutes = [], extraMiddlewares = [], afterRoutes = [] } = {}) {
  const app = express()

  beforeRoutes.forEach(mw => app.use(mw))
  app.use(express.json())
  extraMiddlewares.forEach(mw => app.use(mw))

  app.use('/api', routes)

  afterRoutes.forEach(mw => app.use(mw))
  app.use(tratarErroPadrao)

  return { app, request }
}
