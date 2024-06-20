import dotenv from 'dotenv';
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { expressAppConfig } from 'oas3-tools'
import { Oas3AppOptions } from 'oas3-tools/dist/middleware/oas3.options'
import cors from 'cors'
import logger from './logger'

dotenv.config()

// Settings
const serverPort = 8080
const apiPath = path.join(__dirname, '../api/schema.yaml')
const controllersPath = path.join(__dirname, 'controllers')

// swaggerRouter configuration
const options: Oas3AppOptions = {
  routing: { controllers: controllersPath }
} as Oas3AppOptions
const appConfig = expressAppConfig(apiPath, options)
const app = appConfig.getApp()

// Configure Express App
app.use(cors())

// Initialize the Swagger middleware
const server = createServer(app).listen(serverPort, function () {
  console.log(`Your server is listening at (http://localhost:${serverPort})`)
  console.log(`Swagger-ui is available at (http://localhost:${serverPort}/docs)`)
})

// Process Handlers
process.on('SIGTERM', () => {
  server.close((err: any) => {
    process.exit(err ? 1 : 0)
  })
})

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error}`)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled rejection at ${promise}: ${reason}`)
})