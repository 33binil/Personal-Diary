#!/usr/bin/env node
// Safe deletion script for Entry documents
// Usage (dry-run):
//   node server/scripts/delete-entries.js --userId=<uid> --dry=true
// Usage (delete):
//   node server/scripts/delete-entries.js --userId=<uid> --confirm=true
// Alternate selector: --oldEmail=<email>

import mongoose from 'mongoose'
import Entry from '../src/models/Entry.js'
import dotenv from 'dotenv'

dotenv.config()

const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k,v] = a.replace(/^--/, '').split('=')
  return [k,v]
}))

const { userId, oldEmail, dry, confirm } = argv

if (!userId && !oldEmail) {
  console.error('Please provide --userId or --oldEmail to identify which entries to target')
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

  const docs = await Entry.find(filter).select('_id title date userId creatorEmail creatorName')
  console.log(`Found ${docs.length} entries matching selector`)
  if (docs.length > 0) {
    console.log('Sample entries (up to 20):')
    console.log(JSON.stringify(docs.slice(0,20), null, 2))
  }

  if (dry === 'true' || dry === '1' || dry === 'yes') {
    console.log('Dry run; no deletions performed. To delete, re-run with --confirm=true')
    process.exit(0)
  }

  if (!(confirm === 'true' || confirm === '1' || confirm === 'yes')) {
    console.log('No confirm flag provided. To delete entries, re-run with --confirm=true')
    process.exit(0)
  }

  // Proceed with deletion
  const res = await Entry.deleteMany(filter)
  console.log('Delete result:', res)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
