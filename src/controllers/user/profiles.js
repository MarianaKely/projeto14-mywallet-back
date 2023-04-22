
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

try {

  await mongoClient.connect()
  db = mongoClient.db()

} catch (error) {

}

export async function profiles (req, res) {

    try {

      const analysis = await db.collection("users").find().toArray()
      return res.send(analysis)

    } catch (error) {

      res.status(500).send("Internal Error")
      
    }
  }