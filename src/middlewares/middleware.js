
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

export async function middleware(req, res, next) {

    const { authorization } = req.headers;
    const internalAnalysis = authorization?.replace("Bearer ", "");

    if (!internalAnalysis) return res.status(422).send("Informe o token");

    try {

        const room = await db.collection("sessions").findOne({ token: internalAnalysis });
        if (!room) return res.status(422).send("Acesso negado");
        res.locals.session = room;
        next();

    } catch (err) {

        return res.status(500).send(err);
        
    }

}