import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import router from './routes'
import { requestLogger } from './middlewares/requestLogger.middleware'
import { errorHandler } from './middlewares/error.middleware'

const app: Application = express()

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use(router)

// ─── 404 Handler ─────────────────────────────────────────────────────────────
//
// A 404 error means "the page or route you asked for does not exist".
// Example: a client calls GET /banana — no route matches, so this runs.
//
// This must be placed AFTER all routes so it only runs when nothing else matched.

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
//
// This must be the LAST app.use() in the file.
// Express recognises it as an error handler because it has 4 parameters.
// Any route that calls next(error) will land here.

app.use(errorHandler)

export default app
