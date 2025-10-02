const pool = require('../config/database');

// --- GET all daily logs (optionally filtered by worker) ---
const getAllLogs = async (req, res) => {
    const { workerId } = req.query;
    let client;
    try {
        client = await pool.connect();
        let query, params;
        if (workerId) {
            query = `SELECT * FROM worker_daily_logs WHERE workerId = $1 ORDER BY date DESC`;
            params = [workerId];
        } else {
            query = `SELECT * FROM worker_daily_logs ORDER BY date DESC`;
            params = [];
        }
        const result = await client.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching worker logs:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- GET a single daily log by its ID ---
const getLogById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM worker_daily_logs WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Log not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching worker log:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- CREATE a new daily log ---
const createLog = async (req, res) => {
    const { workerId, date, attendance, hoursWorked, totalHarvest } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO worker_daily_logs (workerId, date, attendance, hoursWorked, totalHarvest) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [workerId, date, attendance, hoursWorked, totalHarvest]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Handle unique constraint violation (e.g., duplicate log for same worker/date)
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A log for this worker on this date already exists.' });
        }
        console.error('Error creating worker log:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- UPDATE a daily log by its ID ---
const updateLog = async (req, res) => {
    const { id } = req.params;
    const { workerId, date, attendance, hoursWorked, totalHarvest } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE worker_daily_logs SET workerId = $1, date = $2, attendance = $3, hoursWorked = $4, totalHarvest = $5 WHERE id = $6 RETURNING *`,
            [workerId, date, attendance, hoursWorked, totalHarvest, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Log not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A log for this worker on this date already exists.' });
        }
        console.error('Error updating worker log:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- DELETE a daily log by its ID ---
const deleteLog = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM worker_daily_logs WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Log not found.' });
        }
        res.status(200).json({ message: 'Log deleted successfully.' });
    } catch (err) {
        console.error('Error deleting worker log:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog
};