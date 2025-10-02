const pool = require('../config/database');

const getAllConnections = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM network_connections ORDER BY id DESC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching network connections:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getConnectionById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM network_connections WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Network connection not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching network connection:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createConnection = async (req, res) => {
    const { signalStrength, quality, bandwidth, latency, status } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO network_connections (signalStrength, quality, bandwidth, latency, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [signalStrength, quality, bandwidth, latency, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating network connection:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateConnection = async (req, res) => {
    const { id } = req.params;
    const { signalStrength, quality, bandwidth, latency, status } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE network_connections SET signalStrength = $1, quality = $2, bandwidth = $3, latency = $4, status = $5 WHERE id = $6 RETURNING *`,
            [signalStrength, quality, bandwidth, latency, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Network connection not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating network connection:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteConnection = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM network_connections WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Network connection not found.' });
        }
        res.status(200).json({ message: 'Network connection deleted successfully.' });
    } catch (err) {
        console.error('Error deleting network connection:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllConnections,
    getConnectionById,
    createConnection,
    updateConnection,
    deleteConnection
};