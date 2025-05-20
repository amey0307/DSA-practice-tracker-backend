import pool from "../middleware/db_connection.middleware.js";

const formatData = (data: any) => {
    const hashMap = new Map();

    data.forEach((row: any) => {
        row.sqlId = row.id;
        if (hashMap.has(row.topicId)) {
            const temp = hashMap.get(row.topicId);
            row.id = `${row.topicId}${temp}`;
            hashMap.set(row.topicId, temp + 1);
        }
        else {
            row.id = `${row.topicId}1`;
            hashMap.set(row.topicId, 2);
        }
    });
    return data;
}

export const allQuestions = async (req: any, res: any) => {
    const { limit, offset, source } = req.query;
    const limitValue = limit ? parseInt(limit) : null;
    const offsetValue = offset ? parseInt(offset) : 0;
    const query = `
        SELECT *
        FROM public."Questions"
        WHERE "source" = '${source}'
        ORDER BY "id" DESC
        LIMIT $1 OFFSET $2
    `;
    const values = [limitValue, offsetValue];
    try {
        const result = await pool.query(query, values);
        const data = result.rows;
        formatData(data);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching all questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

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
        res.status(200).json(formatData(result.rows));
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

export const getQuestionsByName = async (req: any, res: any) => {
    try {
        const { name } = req.params;
        const query = `
            SELECT *
            FROM public."Questions"
            WHERE "name" ILIKE '%' || $1 || '%'
        `;
        const values = [name];
        const result = await pool.query(query, values);
        res.status(200).json(formatData(result.rows));
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const addQuestion = async (req: any, res: any) => {
    try {
        const { name, topicId, question, link } = JSON.parse(req.body);

        if (!name || !topicId || !question || !link) {
            return res.status(400).json({ error: "Name, topicId, and question are required" });
        }

        const query = `
            INSERT INTO public."Questions" ("name", "topicId", "question", "link")
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [name, topicId, question, link];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}