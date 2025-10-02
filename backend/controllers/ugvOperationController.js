const pool = require('../config/database');

const getAllUgvOperations = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM ugv_operations ORDER BY id DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching UGV operations:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getUgvOperationById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM ugv_operations WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'UGV operation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching UGV operation:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createUgvOperation = async (req, res) => {
    const { task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, path } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO ugv_operations (task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, JSON.stringify(path)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid targetAreaId. The specified area does not exist.' });
        }
        console.error('Error creating UGV operation:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateUgvOperation = async (req, res) => {
    const { id } = req.params;
    const { task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, path } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE ugv_operations SET task = $1, targetAreaId = $2, status = $3, progress = $4, batteryLevel = $5, coordinates_lat = $6, coordinates_lng = $7, speed = $8, heading = $9, path = $10 WHERE id = $11 RETURNING *`,
            [task, targetAreaId, status, progress, batteryLevel, coordinates_lat, coordinates_lng, speed, heading, JSON.stringify(path), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'UGV operation not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid targetAreaId. The specified area does not exist.' });
        }
        console.error('Error updating UGV operation:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteUgvOperation = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM ugv_operations WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'UGV operation not found.' });
        }
        res.status(200).json({ message: 'UGV operation deleted successfully.' });
    } catch (err) {
        console.error('Error deleting UGV operation:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllUgvOperations,
    getUgvOperationById,
    createUgvOperation,
    updateUgvOperation,
    deleteUgvOperation
};