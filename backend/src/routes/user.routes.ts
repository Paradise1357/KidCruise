import { Router } from 'express'
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller'

const router = Router()

// POST /api/users — creates a new user
router.post('/', createUser)

// GET /api/users — returns all users, newest first
router.get('/', getUsers)

// GET /api/users/:id — returns a single user by their unique ID
// :id is a route parameter — Express puts its value in req.params.id
router.get('/:id', getUserById)

// PUT /api/users/:id — updates an existing user's name, email, or role
// The client sends only the fields they want to change in the request body
router.put('/:id', updateUser)

// DELETE /api/users/:id — permanently removes a user from the database
router.delete('/:id', deleteUser)

export default router
