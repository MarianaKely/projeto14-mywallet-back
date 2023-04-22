
import { Router } from 'express'
import { signUp } from '../controllers/user/register.js'
import { signIn } from "../controllers/user/register.js"
import { profiles} from "../controllers/user/profiles.js"


const inceptionRouter = Router()


inceptionRouter.post("/sign-up", signUp)
inceptionRouter.post("/sign-in", signIn)
inceptionRouter.get("/users", profiles)


export default inceptionRouter