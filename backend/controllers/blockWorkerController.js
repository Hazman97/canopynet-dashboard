const pool = require('../config/database');

const getAssignmentsByBlockId = async (req, res) => {
    const { blockId } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM block_workers WHERE blockId = $1`, [blockId]);
        res.status(200).json(result.rows);
    } catch (err) { /* ... error handling ... */ } finally { if (client) client.release(); }
};

const createAssignment = async (req, res) => {
    const { blockId, workerId } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO block_workers (blockId, workerId) VALUES ($1, $2) RETURNING *`,
            [blockId, workerId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ message: 'This worker is already assigned to this block.' });
        if (err.code === '23503') return res.status(400).json({ message: 'Invalid blockId or workerId.' });
        // ... error handling ...
    } finally { if (client) client.release(); }
};

const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM block_workers WHERE id = $1`, [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Assignment not found.' });
        res.status(200).json({ message: 'Assignment deleted successfully.' });
    } catch (err) { /* ... error handling ... */ } finally { if (client) client.release(); }
};

module.exports = { getAssignmentsByBlockId, createAssignment, deleteAssignment };