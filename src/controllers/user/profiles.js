
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

try {

  await mongoClient.connect()
  console.log("MongoDB Connected!");
  db = mongoClient.db()

} catch (error) {

  console.log('Problemas no servidor')
}

export async function profiles (req, res) {

    try {

      const analysis = await db.collection("users").find().toArray()
      return res.send(analysis)

    } catch (error) {

      res.status(500).send("Server problems")
      
    }
  }