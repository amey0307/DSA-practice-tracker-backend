import bodyParser from "body-parser";
import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import clerkRouter from "./routes/clerk.router.js"
import testRouter from './routes/test.router.js'
import userRouter from "./routes/user.router.js";
import questionRouter from "./routes/question.router.js"

// Extend IncomingMessage to include rawBody
declare module "http" {
    interface IncomingMessage {
        rawBody?: Buffer;
    }
}

dotenv.config(); // Load environment variables

const app = e();
app.use(clerkMiddleware()); // Clerk middleware
app.use(
    cors({
        origin: [
            "https://dsa-practice-tracker.vercel.app",
            "http://localhost:5173",
            `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
);
app.use(cookieParser());
app.use(bodyParser.raw({ type: "application/json" })); // Parse raw JSON bodies for webhook
app.use(
    bodyParser.json({
        verify: function (req, res, buf) {
            req.rawBody = buf;
        },
    }),
);
app.use(bodyParser.json());
app.use("/api/clerk", clerkRouter);
app.use(e.json());

app.use('/api/test', testRouter);
app.use('/api/user', userRouter);
app.use('/api/questions', questionRouter);

const ip = process.env.IP || 'localhost';
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('-'.repeat(50));
    console.log(`Server is running on http://${ip}:${port}`);
    console.log('-'.repeat(50));
    console.log(`Test Server on http://${ip}:${port}/api/test`);
});