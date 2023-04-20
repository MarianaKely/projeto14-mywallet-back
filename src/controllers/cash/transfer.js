
import dayjs from "dayjs";
import { transferenceSchema } from "../../joi/transferenceSchema.js";
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

export async function transfer(req, res) {

  const time = dayjs().format("DD/MM");
  const room = res.locals.session;
  const { value, description , type} = req.body;

  const { error } = transferenceSchema.validate({

    value,
    description,

  });

  if (error) {

    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);

  }

  if (!room)

    return res.status(422).send("Você não tem acesso, infome o token");

  if (room) {

    const owner = await db.collection("wallets").findOne({ _id: room._id });
    const { name, wallet } = owner;

    try {

      const OwnerShipping = {

        value,
        description,
        date: time,
        type

      };

      await db.collection("wallets").updateOne(

          { _id: room._id },
          { $push: { wallet: { ...OwnerShipping } } }

        );

      res.sendStatus(201);

    } catch (err) {

      res.status(500).send(err);
      
    }
  }
}