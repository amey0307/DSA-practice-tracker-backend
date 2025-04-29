import { Router } from "express";
import bodyParser from 'body-parser';
import { webhook } from "../controller/clerk.controller.ts"

const router = Router();

router.post('/webhooks', bodyParser.raw({ type: 'application/json' }), webhook); // Clerk webhook

export default router;