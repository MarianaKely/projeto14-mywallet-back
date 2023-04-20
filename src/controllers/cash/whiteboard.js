

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

export async function whiteboard(req, res) {

  const room = res.locals.session;

  if (!room) return res.status(422).send("Acesso negado");
  const owner = await db
    .collection("wallets")
    .findOne({ _id: room._id });
  const { name, wallet } = owner;
  return res.status(202).send({ name, wallet });

}