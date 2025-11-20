import express from "express";
import { summarize, quiz, homework } from "../controllers/studyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/summarize", requireAuth, summarize);
router.post("/quiz", requireAuth, quiz);
router.post("/homework", requireAuth, homework);

export default router;
