const pool = require('../config/database');

const getAllAssets = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM assets ORDER BY name ASC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching assets:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const getAssetById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM assets WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Asset not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching asset:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const createAsset = async (req, res) => {
    const { name, type, category, status, model, operator, assignedWorker, images } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO assets (name, type, category, status, model, operator, assignedWorker, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, type, category, status, model, operator, assignedWorker, JSON.stringify(images)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid operator or assignedWorker ID. The specified worker does not exist.' });
        }
        console.error('Error creating asset:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const updateAsset = async (req, res) => {
    const { id } = req.params;
    const { name, type, category, status, model, operator, assignedWorker, images } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE assets SET name = $1, type = $2, category = $3, status = $4, model = $5, operator = $6, assignedWorker = $7, images = $8 WHERE id = $9 RETURNING *`,
            [name, type, category, status, model, operator, assignedWorker, JSON.stringify(images), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Asset not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23503') {
            return res.status(400).json({ message: 'Invalid operator or assignedWorker ID. The specified worker does not exist.' });
        }
        console.error('Error updating asset:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

const deleteAsset = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`DELETE FROM assets WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Asset not found.' });
        }
        res.status(200).json({ message: 'Asset deleted successfully.' });
    } catch (err) {
        console.error('Error deleting asset:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};