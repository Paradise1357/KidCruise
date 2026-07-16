// ─── What is a Service? ──────────────────────────────────────────────────────
//
// The service contains the business logic of your application.
// It sits between the controller (which handles HTTP) and the
// repository (which handles the database).
//
// The service does not know about req or res — it just receives
// plain data, does its work, and returns a result.
//
// ─────────────────────────────────────────────────────────────────────────────

import { Role } from '@prisma/client'
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../repositories/user.repository'

// The shape of data the service expects to receive when creating a user
interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: Role
}

// The shape of data the service expects when updating a user.
// All fields are optional — the caller only sends what they want to change.
// Password is excluded by design: it cannot be updated through this flow.
interface UpdateUserInput {
  name?: string
  email?: string
  role?: Role
}

export const createUserService = async (input: CreateUserInput) => {
  // Right now we pass the data straight to the repository.
  // In a future sprint, password hashing will happen here before saving.
  const user = await createUser(input)
  return user
}

// Retrieves all users — no filtering or pagination yet
export const getAllUsersService = async () => {
  const users = await getAllUsers()
  return users
}

// Retrieves a single user by their ID.
//
// The service calls the repository and simply passes the result back.
// If the repository returns null (user not found), we also return null.
// The controller is responsible for turning that null into a 404 response.
export const getUserByIdService = async (id: string) => {
  const user = await getUserById(id)
  return user // will be null if no user with this id exists
}

// Updates an existing user's allowed fields (name, email, role).
//
// Step 1 — existence check:
//   We first call getUserById to see if the user actually exists.
//   If it returns null, we return null immediately.
//   The controller will translate that null into a 404 response.
//
// Step 2 — update:
//   If the user exists, we call the repository to apply the changes.
//   Prisma will only update the fields that are present in `input`.
//   Fields not included in `input` are left exactly as they are.
export const updateUserService = async (id: string, input: UpdateUserInput) => {
  // Check if the user exists before attempting to update
  const existingUser = await getUserById(id)

  // Return null to signal "user not found" — the controller handles the 404
  if (!existingUser) {
    return null
  }

  // User exists — proceed with the update and return the updated record
  const updatedUser = await updateUser(id, input)
  return updatedUser
}

// Deletes a user by their ID.
//
// Step 1 — existence check:
//   We call getUserById first to confirm the user is in the database.
//   If it returns null, we return null immediately so the controller
//   can send back a clean 404 — "User not found".
//
// Step 2 — delete:
//   If the user exists, we call the repository to permanently remove the row.
//   We return true to signal to the controller that deletion succeeded.
export const deleteUserService = async (id: string) => {
  // Check if the user exists before attempting to delete
  const existingUser = await getUserById(id)

  // Return null to signal "user not found" — the controller handles the 404
  if (!existingUser) {
    return null
  }

  // User exists — delete the record from the database
  await deleteUser(id)

  // Return true so the controller knows the deletion was successful
  return true
}
