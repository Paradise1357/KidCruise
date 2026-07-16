// ─── What is a Global Error Handler? ─────────────────────────────────────────
//
// A global error handler is a special middleware that catches ANY error thrown
// anywhere in your app and returns a clean JSON response instead of crashing.
//
// Without it, if something breaks inside a route, Express either:
//   - Sends an ugly HTML error page the frontend cannot read
//   - Crashes the entire server
//
// With it, every error is caught in one place and handled the same clean way.
//
// Express knows this is an error handler because it has FOUR parameters.
// The first one is always the error object: (err, req, res, next)
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Sanitize the error message before logging to prevent log injection
  const message = (err.message || 'Unknown error').replace(/[\r\n]/g, '')
  console.error(`[ERROR] ${message}`)

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  })
}
