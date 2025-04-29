import pool from "../middleware/db_connection.middleware.ts";

export const registerUser = async (req: any, res: any) => {
    const { email, username, clerk_id } = JSON.parse(req.body);

    if (!email || !username || !clerk_id) {
        return res.status(400).json({
            success: false,
            message: 'Error: Please provide all required fields',
        });
    }

    const query = `INSERT INTO "public"."Users" (email, username, clerk_id) VALUES ($1, $2, $3) RETURNING id, email, username, clerk_id;`;
    const values = [email, username, clerk_id];

    try {
        const result = await pool.query(query, values);
        const user = result.rows[0];
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error registering user',
        });
    }
}