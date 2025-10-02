const pool = require('../config/database');

const getAllAreas = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM areas ORDER BY name ASC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching areas:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getAreaById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM areas WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Area not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching area:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createArea = async (req, res) => {
    const { name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, boundary, blockId } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO areas (name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, boundary, blockId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, JSON.stringify(boundary), blockId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid blockId. The specified block does not exist.' });
        }
        console.error('Error creating area:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateArea = async (req, res) => {
    const { id } = req.params;
    const { name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, boundary, blockId } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE areas SET name = $1, coordinates_lat = $2, coordinates_lng = $3, size = $4, coverage = $5, status = $6, estimatedYield = $7, boundary = $8, blockId = $9 WHERE id = $10 RETURNING *`,
            [name, coordinates_lat, coordinates_lng, size, coverage, status, estimatedYield, JSON.stringify(boundary), blockId, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Area not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid blockId. The specified block does not exist.' });
        }
        console.error('Error updating area:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteArea = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM areas WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Area not found.' });
        }
        res.status(200).json({ message: 'Area deleted successfully.' });
    } catch (err) {
        console.error('Error deleting area:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllAreas,
    getAreaById,
    createArea,
    updateArea,
    deleteArea
};