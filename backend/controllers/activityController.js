const pool = require('../config/database');

const getAllActivities = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM activities ORDER BY startTime DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getActivityById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM activities WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Activity not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching activity:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createActivity = async (req, res) => {
    const { workerId, type, areaId, startTime, endTime, quantity, status } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO activities (workerId, type, areaId, startTime, endTime, quantity, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [workerId, type, areaId, startTime, endTime, quantity, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid workerId or areaId. The specified worker or area does not exist.' });
        }
        console.error('Error creating activity:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { workerId, type, areaId, startTime, endTime, quantity, status } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE activities SET workerId = $1, type = $2, areaId = $3, startTime = $4, endTime = $5, quantity = $6, status = $7 WHERE id = $8 RETURNING *`,
            [workerId, type, areaId, startTime, endTime, quantity, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Activity not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid workerId or areaId. The specified worker or area does not exist.' });
        }
        console.error('Error updating activity:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteActivity = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM activities WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Activity not found.' });
        }
        res.status(200).json({ message: 'Activity deleted successfully.' });
    } catch (err) {
        console.error('Error deleting activity:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity
};