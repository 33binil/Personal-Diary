#!/usr/bin/env node
// Usage: node update-user-metadata.js --userId=<uid> --newEmail=<email> --newName="New Name" [--dry]
// or:    node update-user-metadata.js --oldEmail=<oldEmail> --newEmail=<email> --newName="New Name" [--dry]

import mongoose from 'mongoose'
import Entry from '../src/models/Entry.js'
import dotenv from 'dotenv'

dotenv.config()

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k,v] = a.replace(/^--/, '').split('=')
  return [k,v]
}))

const { userId, oldEmail, newEmail, newName, dry } = argv

if (!newEmail && !newName) {
  console.error('Please provide --newEmail or --newName')
  process.exit(1)
}

if (!userId && !oldEmail) {
  console.error('Please provide --userId or --oldEmail to identify entries to update')
  process.exit(1)
}

async function main(){
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('MONGODB_URI not set in environment')
    process.exit(1)
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'diary' })
  console.log('Connected to MongoDB')

  const filter = {}
  if (userId) filter.userId = userId
  if (oldEmail) filter.creatorEmail = oldEmail

  const toUpdate = await Entry.find(filter).select('_id creatorEmail creatorName userId')
  console.log(`Found ${toUpdate.length} entries to update`)
  if (toUpdate.length === 0) process.exit(0)

  if (dry === 'true' || dry === '1') {
    console.log('Dry run; no changes will be made')
    console.log(JSON.stringify(toUpdate.slice(0, 20), null, 2))
    process.exit(0)
  }

  let updated = 0
  for (const e of toUpdate) {
    const update = {}
    if (newEmail) update.creatorEmail = newEmail
    if (newName) update.creatorName = newName
    await Entry.updateOne({ _id: e._id }, { $set: update })
    updated++
  }
  console.log(`Updated ${updated} entries`)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
