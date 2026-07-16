// ─── What is a Repository? ───────────────────────────────────────────────────
//
// The repository is the only layer that talks directly to the database.
// It contains raw Prisma queries and nothing else.
//
// No business logic lives here — just "save this", "find that", "delete this".
// This keeps database code in one place so it's easy to find and change.
//
// ─────────────────────────────────────────────────────────────────────────────

import prisma from '../config/database'
import { Role } from '@prisma/client'

// The shape of data required to create a new user
interface CreateUserData {
  name: string
  email: string
  password: string
  role?: Role
}

// The shape of data allowed when updating a user.
//
// All three fields are optional (marked with ?) because the caller may want
// to update only one of them — e.g. just the name — without touching the rest.
//
// Notice that `password` is NOT listed here.
// This interface acts as a hard boundary: it is impossible to accidentally
// update the password through this function.
interface UpdateUserData {
  name?: string
  email?: string
  role?: Role
}

// Inserts a new user row into the database and returns the created user
export const createUser = async (data: CreateUserData) => {
  return await prisma.user.create({ data })
}

// Fetches all users from the database, newest first
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

// Finds a single user by their unique ID.
//
// findUnique() is Prisma's way of saying "find exactly one record".
// It returns the user if found, or null if no record matches.
//
// The `select` block tells Prisma which columns to return.
// Password is intentionally left out — we never send it to the client.
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id }, // look for a user whose id matches the given value
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // password is NOT selected — it stays safely in the database
    },
  })
}

// Updates an existing user record in the database.
//
// prisma.user.update() requires a `where` clause (which record to update)
// and a `data` object (what to change). Prisma builds the SQL SET clause
// from only the fields that are present in `data`.
//
// The `select` block ensures the password is never returned to the caller,
// exactly the same as in getUserById above.
export const updateUser = async (id: string, data: UpdateUserData) => {
  return await prisma.user.update({
    where: { id }, // target the specific user row by primary key
    data,          // only the fields passed in will be updated
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // password is NOT selected — never sent to the client
    },
  })
}

// Deletes a user row from the database by their unique ID.
//
// prisma.user.delete() permanently removes the record.
// There is no soft-delete here — the row is gone from the database.
//
// We do NOT use a `select` block because delete() does not return
// data to the client — the controller only sends a success message.
export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id }, // identify the exact row to remove by its primary key
  })
}
