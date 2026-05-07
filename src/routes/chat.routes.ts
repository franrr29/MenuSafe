import { Router } from "express"
import { getMenu } from "../controller/chat.controller"
import { getRecommendation  } from "../controller/chat.controller"

const router = Router()

router.get("/menu", getMenu)
router.post ("/recommendations", getRecommendation)

export default router