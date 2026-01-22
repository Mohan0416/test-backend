import { Router } from "express";
import { signupUser, signupBrand, login, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

router.post('/signup/user', signupUser)
router.post('/signup/brand', signupBrand)
router.post('/login', login)
router.post('/logout', authMiddleware, logout)

export default router