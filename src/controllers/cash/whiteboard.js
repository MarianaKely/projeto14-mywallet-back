

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

export async function whiteboard(req, res) {

  const room = res.locals.session;

  if (!room) return res.status(422).send("Access Denied");

  const owner = await db.collection("mycash").findOne({ _id: room._id });
  const { name, wallet } = owner;
  
  return res.status(200).send({ name, wallet });

}