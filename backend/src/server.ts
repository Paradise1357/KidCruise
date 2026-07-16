import app from './app'
import { env } from './config/env'

const PORT = env.PORT

app.listen(PORT, () => {
  console.log('─────────────────────────────────────────')
  console.log('🚍  KidCruise Backend')
  console.log(`📦  Environment : ${env.NODE_ENV}`)
  console.log(`🌐  Server URL  : http://localhost:${PORT}`)
  console.log('─────────────────────────────────────────')
})
