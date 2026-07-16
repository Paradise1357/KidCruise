import { Router, Request, Response } from 'express'

const router = Router()

// Project info stored once — used by the GET /info route below
const PROJECT_INFO = {
  project: 'KidCruise',
  version: '1.0.0',
  status: 'Development',
  backend: 'Express.js',
  language: 'TypeScript',
  database: 'PostgreSQL (Coming Soon)',
  developer: 'Prasad Ulemale',
}

// GET / — confirms the server is alive
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'KidCruise Backend is Running 🚍',
  })
})

// GET /info — returns general information about this project
router.get('/info', (_req: Request, res: Response) => {
  res.status(200).json(PROJECT_INFO)
})

export default router
