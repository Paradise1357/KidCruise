import { Router } from 'express'
import healthRouter from './health.routes'
import userRouter from './user.routes'

const router = Router()

// Health and info routes
router.use('/', healthRouter)

// User routes — all user endpoints are prefixed with /api/users
router.use('/api/users', userRouter)

export default router
