
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

export async function cash(_, res) {
  try {
    const room = res.locals.session;
    const shipping = await db
      .collection("wallets")
      .find({ _id: room._id })
      .toArray();

    let amount = 0;

    if (shipping[0].wallet.length > 0) {
      shipping[0].wallet.map((t) =>
        t.type === "deposit"
          ? (amount += parseFloat(t.value))
          : (amount -= parseFloat(t.value))
      );
      res.status(200).json(amount.toFixed(2));
    } else {
      res.status(200).send("No transactons");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}