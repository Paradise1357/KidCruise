// dotenv reads your .env file and loads the values
// into Node's process.env so your code can access them
import dotenv from 'dotenv'

dotenv.config()

// A single config object that holds all environment variables.
// Every other file imports from here — not directly from process.env.
export const env = {
  // The port number the server will listen on.
  // Falls back to 5000 if PORT is not set in .env
  PORT: process.env.PORT || '5000',

  // Tells the app whether it's running in 'development' or 'production'.
  // Falls back to 'development' if NODE_ENV is not set in .env
  NODE_ENV: process.env.NODE_ENV || 'development',
}
