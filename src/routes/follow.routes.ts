    import { Router } from "express";
    import { authMiddleware } from "../middlewares/auth.middleware";
    import { followBrand, unfollowBrand, getFollowingBrands } from "../controllers/follow.controller";

    const router = Router()
    
    router.get('/me',authMiddleware, getFollowingBrands)
    router.post("/:brandId",authMiddleware, followBrand)
    router.delete("/:brandId",authMiddleware, unfollowBrand)

    export default router