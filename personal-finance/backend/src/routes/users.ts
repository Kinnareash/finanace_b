import { Router } from "express";
import { getUserProfile, updateUserProfile, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();



router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.delete("/profile", authMiddleware, deleteUser);

export default router;
