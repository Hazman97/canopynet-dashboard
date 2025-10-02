const pool = require('../config/database');

const getAllWorkers = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT * FROM workers ORDER BY lastUpdate DESC`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching workers:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

const getWorkerById = async (req, res) => {
  const { id } = req.params;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT * FROM workers WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Worker not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching worker:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

const createWorker = async (req, res) => {
  const { name, code, workDivision, role, status, blockNo, taskNo } = req.body;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO workers (name, code, workDivision, role, status, blockNo, taskNo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, code, workDivision, role, status, blockNo, taskNo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating worker:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

const updateWorker = async (req, res) => {
  const { id } = req.params;
  const { name, code, workDivision, role, status, blockNo, taskNo } = req.body;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `UPDATE workers SET name = $1, code = $2, workDivision = $3, role = $4, status = $5, blockNo = $6, taskNo = $7, lastUpdate = NOW() WHERE id = $8 RETURNING *`,
      [name, code, workDivision, role, status, blockNo, taskNo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Worker not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating worker:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

const deleteWorker = async (req, res) => {
  const { id } = req.params;
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`DELETE FROM workers WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Worker not found.' });
    }
    res.status(200).json({ message: 'Worker deleted successfully.' });
  } catch (err) {
    console.error('Error deleting worker:', err);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
};