
import express from "express"
import cors from "cors"
import inceptionRouter from "./routes/inceptionRouter.js"
import cashRouter from "./routes/cashRouter.js"


const PORT = process.env.PORT || 5000;


const server = express()
server.use(express.json())
server.use(cors())

server.use([inceptionRouter])
server.use([cashRouter])


server.listen(PORT, () => {console.log(`HI ITS ME!!!`)})

