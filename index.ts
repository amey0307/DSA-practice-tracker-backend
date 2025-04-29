import bodyParser from "body-parser";
import e from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";
import clerkRouter from "./routes/clerk.router.ts"
import testRouter from './routes/test.router.ts'

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
        origin: "http://localhost:5173", // Replace with your frontend URL
        credentials: true, // Allow cookies
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

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});