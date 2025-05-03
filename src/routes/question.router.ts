import { Router } from "express";
import { getQuestionById, getQuestions } from "../controller/question.controller.js";

const router = Router();

router.get("/get-question-by-id/:questionId", getQuestionById);
router.get("/get-questions/:topicId", getQuestions);

export default router;