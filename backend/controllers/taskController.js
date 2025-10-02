const pool = require('../config/database');

const getAllTasks = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM tasks ORDER BY createdAt DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getTaskById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching task:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createTask = async (req, res) => {
    const { title, type, targetAreaId, blockId, status, startDate, endDate, actualDuration, progress, createdById, workDivisionId, workNature } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO tasks (title, type, targetAreaId, blockId, status, startDate, endDate, actualDuration, progress, createdById, workDivisionId, workNature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [title, type, targetAreaId, blockId, status, startDate, endDate, actualDuration, progress, createdById, workDivisionId, workNature]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid foreign key. The specified area, block, worker, or work division does not exist.' });
        }
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, type, targetAreaId, blockId, status, startDate, endDate, actualDuration, progress, createdById, workDivisionId, workNature } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE tasks SET title = $1, type = $2, targetAreaId = $3, blockId = $4, status = $5, startDate = $6, endDate = $7, actualDuration = $8, progress = $9, createdById = $10, workDivisionId = $11, workNature = $12, updatedAt = NOW() WHERE id = $13 RETURNING *`,
            [title, type, targetAreaId, blockId, status, startDate, endDate, actualDuration, progress, createdById, workDivisionId, workNature, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid foreign key. The specified area, block, worker, or work division does not exist.' });
        }
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM tasks WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};