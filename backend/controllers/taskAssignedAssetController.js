const pool = require('../config/database');

const getAssetsByTaskId = async (req, res) => {
    const { taskId } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM task_assigned_assets WHERE taskId = $1`, [taskId]);
        res.status(200).json(result.rows);
    } catch (err) { /* ... error handling ... */ } finally { if (client) client.release(); }
};

const createAssignment = async (req, res) => {
    const { taskId, assetId } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO task_assigned_assets (taskId, assetId) VALUES ($1, $2) RETURNING *`,
            [taskId, assetId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ message: 'This asset is already assigned to this task.' });
        if (err.code === '23503') return res.status(400).json({ message: 'Invalid taskId or assetId.' });
        // ... error handling ...
    } finally { if (client) client.release(); }
};

const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM task_assigned_assets WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Assignment not found.' });
        res.status(200).json({ message: 'Assignment deleted successfully.' });
    } catch (err) { /* ... error handling ... */ } finally { if (client) client.release(); }
};

module.exports = { getAssetsByTaskId, createAssignment, deleteAssignment };