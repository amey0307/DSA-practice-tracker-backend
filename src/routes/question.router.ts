import { Router } from "express";
import { allQuestions, getQuestionById, getQuestions, getQuestionsByName } from "../controller/question.controller.js";

const router = Router();

router.get("/all-questions", allQuestions);
router.get("/get-question-by-id/:questionId", getQuestionById);
router.get("/get-questions/:topicId", getQuestions);
router.get("/get-questions-by-name/:name", getQuestionsByName);

export default router;