// ─── What is Middleware? ──────────────────────────────────────────────────────
//
// Middleware is a function that runs BETWEEN the moment a request arrives
// and the moment your route sends a response.
//
// Every request passes through middleware in order, like a pipeline:
//
//   Request → helmet() → cors() → json() → requestLogger → your route → Response
//
// Each middleware receives three things:
//   req  — the incoming request (method, URL, body, headers...)
//   res  — the outgoing response (what you send back)
//   next — a function that passes control to the next step in the pipeline
//
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express'

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Format the current date and time as YYYY-MM-DD HH:MM:SS
  const now = new Date()
  const date = now.toISOString().replace('T', ' ').substring(0, 19)

  // Sanitize method and URL — strip newline characters to prevent log injection
  const method = req.method.replace(/[\r\n]/g, '')
  const url = req.url.replace(/[\r\n]/g, '')

  console.log(`[${date}]`)
  console.log(`${method} ${url}`)
  console.log('----------------------------')

  // next() is required — without it the request gets stuck here forever
  // and your route will never send a response back to the client.
  // Calling next() tells Express: "this middleware is done, move to the next step"
  next()
}
