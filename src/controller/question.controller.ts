import pool from "../middleware/db_connection.middleware.js";

export const getQuestions = async (req: any, res: any) => {
    try {
        const { topicId } = req.params;
        const query = `
            SELECT *
            FROM public."Questions"
           ${topicId && `WHERE "topicId" = $1`}
                `;
        const values = [topicId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getQuestionById = async (req: any, res: any) => {
    try {
        const { questionId } = req.params;
        const query = `
            SELECT *
            FROM public."Questions"
            WHERE "id" = $1 
        `;
        const values = [questionId];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}