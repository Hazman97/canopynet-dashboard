const pool = require('../config/database');

const getAllBlocks = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM blocks ORDER BY name ASC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching blocks:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getBlockById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM blocks WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Block not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching block:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createBlock = async (req, res) => {
    const { name, blockNumber, phaseId, area } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO blocks (name, blockNumber, phaseId, area) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, blockNumber, phaseId, area]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Handle foreign key violation if phaseId doesn't exist
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid phaseId. The specified phase does not exist.' });
        }
        console.error('Error creating block:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateBlock = async (req, res) => {
    const { id } = req.params;
    const { name, blockNumber, phaseId, area } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE blocks SET name = $1, blockNumber = $2, phaseId = $3, area = $4 WHERE id = $5 RETURNING *`,
            [name, blockNumber, phaseId, area, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Block not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid phaseId. The specified phase does not exist.' });
        }
        console.error('Error updating block:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteBlock = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM blocks WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Block not found.' });
        }
        res.status(200).json({ message: 'Block deleted successfully.' });
    } catch (err) {
        console.error('Error deleting block:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllBlocks,
    getBlockById,
    createBlock,
    updateBlock,
    deleteBlock
};