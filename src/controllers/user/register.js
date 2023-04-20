
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { registerSchema } from "../../joi/registerSchema.js";
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

export async function signIn(req, res) {
  const { email, password } = req.body;

  const generateCode = uuidv4();

  try {
    const internalAnalysis = await db.collection("users").findOne({ email });

    if (!internalAnalysis) return res.status(400).send("Usuário ou senha incorretos");

    const psswrd = bcrypt.compareSync(password, internalAnalysis.password);

    if (!psswrd) {
      return res.status(400).send("Usuário ou senha incorretos");
    }

    const completeProfile = await db
      .collection("sessions")
      .findOne({ _id: internalAnalysis._id });
    if (completeProfile) {
      await db.collection("sessions").updateOne(
        { _id: internalAnalysis._id },
        {
          $set: { token: generateCode },
        }
      );
    } else {
      const invalid = await db
        .collection("sessions")
        .findOne({ _id: internalAnalysis._id });
      if (!invalid) {
        await db
          .collection("sessions")
          .insertOne({ _id: internalAnalysis._id, token: generateCode });
      }
    }

    const checkk = await db
      .collection("wallets")
      .findOne({ _id: internalAnalysis._id });

    if (!checkk) {
      const mainUser = {
        _id: internalAnalysis._id,
        name: internalAnalysis.name,
        wallet: [],
      };
      await db.collection("wallets").insertOne(mainUser);
    }
    return res.status(202).send(generateCode);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  const { error } = registerSchema.validate({
    name,
    email,
    password,
    confirmPassword,
  });

  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);
  }

  const shibboleth = bcrypt.hashSync(password, 10);

  try {
    const invalid = await db
      .collection("users")
      .findOne({ email: email });
    if (invalid)
      return res.status(400).send("Este email já está sendo usado!");

    await db
      .collection("users")
      .insertOne({ name, email, password: shibboleth });
    res.status(201).send("Usuário cadastrado com sucesso!");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

