import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getuserProfile } from "../controllers/userController.js";
import { followUnfollowUser } from "../controllers/userController.js";
import { getSuggestedUsers } from "../controllers/userController.js";
import { updateUser } from "../controllers/userController.js";



const router = express.Router();

router.get("/profile/:username", protectRoute, getuserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUser);

export default router;