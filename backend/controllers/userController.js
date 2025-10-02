const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// --- Registration Logic ---
const registerUser = async (req, res) => {
  const { username, password, role, email } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  const emailToSave = email && email.trim() !== '' ? email : null;

  let client;
  try {
    client = await pool.connect();
    const existingUser = await client.query(`SELECT id FROM users WHERE username = $1`, [username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    if (emailToSave) {
      const existingEmail = await client.query(`SELECT id FROM users WHERE email = $1`, [emailToSave]);
      if (existingEmail.rows.length > 0) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserResult = await client.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, emailToSave, hashedPassword, role]
    );
    const newUser = newUserResult.rows[0];

    res.status(201).json({ message: 'User registered successfully!', ...newUser });
  } catch (err) {
    console.error('Database error during registration:', err.message);
    res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

// --- Login Logic ---
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT id, username, email, password_hash, role FROM users WHERE username = $1`, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      await client.query(`UPDATE users SET last_login = NOW() WHERE id = $1`, [user.id]);
      const updatedUserResult = await client.query(`SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1`, [user.id]);
      const updatedUser = updatedUserResult.rows[0];

      return res.status(200).json({ message: 'Login successful!', ...updatedUser });
    } else {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error('Database error during login:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  registerUser,
  loginUser,
};