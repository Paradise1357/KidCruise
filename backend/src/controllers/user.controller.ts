// ─── What is a Controller? ───────────────────────────────────────────────────
//
// The controller is the entry point for an HTTP request.
// Its only jobs are:
//   1. Read data from the request (req.body, req.params, req.query)
//   2. Pass that data to the service
//   3. Send the result back as an HTTP response
//
// The controller never talks to the database directly.
// All business logic stays in the service.
//
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response } from 'express'
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from '../services/user.service'

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Read the fields sent in the request body
    const { name, email, password, role } = req.body

    // Pass the data to the service which handles the business logic
    const user = await createUserService({ name, email, password, role })

    // Send back a success response with the created user
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    })
  } catch (error: unknown) {
    // Prisma throws a specific error code when a unique constraint is violated.
    // P2002 means: "A record with this value already exists."
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      })
      return
    }

    // For any other unexpected error, return a generic 500 response
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Ask the service to fetch all users from the database
    const users = await getAllUsersService()

    // users.length gives us the total count without an extra database call
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}

// GET /api/users/:id — fetch a single user by their unique ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.params.id holds the value from the URL.
    // Example: for /api/users/abc-123, req.params.id === "abc-123"
    // We cast to string because Express types params as string | string[],
    // but route params are always a single string value at runtime.
    const id = req.params.id as string

    // Pass the id to the service which calls the repository
    const user = await getUserByIdService(id)

    // If the service returns null, no user was found with that id
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return // stop here — do not run the success block below
    }

    // User was found — send it back with a 200 OK status
    // The password is already excluded at the repository layer (via Prisma select)
    res.status(200).json({
      success: true,
      data: user,
    })
  } catch {
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}

// PUT /api/users/:id — update an existing user's name, email, or role
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Read the target user's id from the URL parameter
    // Example: PUT /api/users/abc-123  →  req.params.id === "abc-123"
    const id = req.params.id as string

    // Read only the allowed fields from the request body.
    // Destructuring like this means even if the client sends a `password`
    // field, we simply ignore it — it never reaches the service or database.
    const { name, email, role } = req.body

    // Pass the id and the allowed fields to the service.
    // The service will first check whether the user exists,
    // then delegate the actual database write to the repository.
    const updatedUser = await updateUserService(id, { name, email, role })

    // The service returns null when no user was found with that id
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return // stop here — do not fall through to the success block
    }

    // Update succeeded — send back the updated user (password excluded)
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (error: unknown) {
    // Prisma error P2002 means a unique constraint was violated.
    // Here it fires when the new email is already taken by another user.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      })
      return
    }

    // Catch-all for any other unexpected errors
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}

// DELETE /api/users/:id — permanently remove a user from the database
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Read the target user's id from the URL parameter
    // Example: DELETE /api/users/abc-123  →  req.params.id === "abc-123"
    const id = req.params.id as string

    // Pass the id to the service.
    // The service checks whether the user exists first,
    // then calls the repository to delete the record.
    const result = await deleteUserService(id)

    // The service returns null when no user was found with that id
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      })
      return // stop here — do not fall through to the success block
    }

    // Deletion succeeded — no data to return, just a confirmation message
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch {
    // Catch-all for any unexpected errors
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    })
  }
}
