const express = require('express');
const router = express.Router();
const { getAllConnections, getConnectionById, createConnection, updateConnection, deleteConnection } = require('../controllers/networkConnectionController');

/**
 * @swagger
 * /api/network-connections:
 *   get:
 *     summary: Get a list of all network connections
 *     responses:
 *       200:
 *         description: A list of network connections.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NetworkConnectionResponse'
 */
router.get('/', getAllConnections);

/**
 * @swagger
 * /api/network-connections/{id}:
 *   get:
 *     summary: Get a single network connection by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single network connection object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NetworkConnectionResponse'
 */
router.get('/:id', getConnectionById);

/**
 * @swagger
 * /api/network-connections:
 *   post:
 *     summary: Create a new network connection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NetworkConnectionInput'
 *     responses:
 *       201:
 *         description: Network connection created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NetworkConnectionResponse'
 */
router.post('/', createConnection);

/**
 * @swagger
 * /api/network-connections/{id}:
 *   put:
 *     summary: Update a network connection by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NetworkConnectionInput'
 *     responses:
 *       200:
 *         description: Network connection updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NetworkConnectionResponse'
 */
router.put('/:id', updateConnection);

/**
 * @swagger
 * /api/network-connections/{id}:
 *   delete:
 *     summary: Delete a network connection by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Network connection deleted successfully.
 */
router.delete('/:id', deleteConnection);

module.exports = router;