import express from "express";
import { registerUser, loginUser, logoutUser, getProfile, deleteUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/delete", verifyToken, deleteUser);

// Protegida con JWT
router.get("/profile", verifyToken, getProfile);

export default router;
