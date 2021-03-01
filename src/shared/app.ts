import 'reflect-metadata'

import express, { Request, Response, NextFunction } from 'express'

import createConnection from '../database'

import { router } from './routes'

import AppError from './errors/AppError'

import 'express-async-errors'

import cors from 'cors'

createConnection()

const app = express()

app.use(express.json())

app.use(cors())

app.use(router)

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error('Custom Error', err)

  return response.status(500).json({
    status: 'error',
    message: `Internal server error ${err.message}`,
  })
})

export default app
