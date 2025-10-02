const pool = require('../config/database');

const getAllPhases = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM phases ORDER BY establishedDate DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching phases:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getPhaseById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM phases WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Phase not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching phase:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createPhase = async (req, res) => {
    const { name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, boundary, status, establishedDate } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO phases (name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, boundary, status, establishedDate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, JSON.stringify(boundary), status, establishedDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating phase:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updatePhase = async (req, res) => {
    const { id } = req.params;
    const { name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, boundary, status, establishedDate } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE phases SET name = $1, phaseNumber = $2, totalArea = $3, totalBlocks = $4, coordinates_lat = $5, coordinates_lng = $6, boundary = $7, status = $8, establishedDate = $9 WHERE id = $10 RETURNING *`,
            [name, phaseNumber, totalArea, totalBlocks, coordinates_lat, coordinates_lng, JSON.stringify(boundary), status, establishedDate, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Phase not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating phase:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deletePhase = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM phases WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Phase not found.' });
        }
        res.status(200).json({ message: 'Phase deleted successfully.' });
    } catch (err) {
        console.error('Error deleting phase:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllPhases,
    getPhaseById,
    createPhase,
    updatePhase,
    deletePhase
};