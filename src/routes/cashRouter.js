
import { Router } from 'express'
import { whiteboard } from '../controllers/cash/whiteboard.js'
import { transfer } from '../controllers/cash/transfer.js'
import { middleware } from '../middlewares/middleware.js'
import { cash } from '../controllers/cash/cash.js'

const cashRouter = Router()

cashRouter.use(middleware)

cashRouter.get("/cash",cash )
cashRouter.get("/whiteboard", whiteboard)
cashRouter.post("/transfer", transfer)

export default cashRouter