import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getNotification, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/v", protectRoute, deleteNotification);

export default router;