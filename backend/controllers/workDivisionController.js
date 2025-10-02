const pool = require('../config/database');

// --- GET all work divisions ---
const getAllWorkDivisions = async (req, res) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM work_divisions ORDER BY name ASC`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching work divisions:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- GET a single work division by ID ---
const getWorkDivisionById = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`SELECT * FROM work_divisions WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Work division not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching work division:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- CREATE a new work division ---
const createWorkDivision = async (req, res) => {
    const { name, workNatures } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `INSERT INTO work_divisions (name, workNatures) VALUES ($1, $2) RETURNING *`,
            [name, JSON.stringify(workNatures)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Handle unique constraint violation for the name
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A work division with this name already exists.' });
        }
        console.error('Error creating work division:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- UPDATE a work division by ID ---
const updateWorkDivision = async (req, res) => {
    const { id } = req.params;
    const { name, workNatures } = req.body;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            `UPDATE work_divisions SET name = $1, workNatures = $2 WHERE id = $3 RETURNING *`,
            [name, JSON.stringify(workNatures), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Work division not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A work division with this name already exists.' });
        }
        console.error('Error updating work division:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

// --- DELETE a work division by ID ---
const deleteWorkDivision = async (req, res) => {
    const { id } = req.params;
    let client;
    try {
        client = await pool.connect();
        // Check if any tasks are using this division before deleting
        const taskCheck = await client.query(`SELECT id FROM tasks WHERE workDivisionId = $1`, [id]);
        if (taskCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Cannot delete work division, it is being used by one or more tasks.' });
        }

        const result = await client.query(`DELETE FROM work_divisions WHERE id = $1`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Work division not found.' });
        }
        res.status(200).json({ message: 'Work division deleted successfully.' });
    } catch (err) {
        console.error('Error deleting work division:', err);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllWorkDivisions,
    getWorkDivisionById,
    createWorkDivision,
    updateWorkDivision,
    deleteWorkDivision
};