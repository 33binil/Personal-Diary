import mongoose from 'mongoose'
import 'dotenv/config'

async function test() {
  const uri = process.env.MONGODB_URI
  console.log('Using MONGODB_URI:', uri)
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'diary' })
    console.log('MongoDB connection successful')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('MongoDB connection failed:')
    console.error(err && err.message ? err.message : err)
    process.exit(1)
  }
}

test()
