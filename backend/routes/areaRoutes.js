const express = require('express');
const router = express.Router();
const { getAllAreas, getAreaById, createArea, updateArea, deleteArea } = require('../controllers/areaController');

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Get a list of all areas
 *     responses:
 *       200:
 *         description: A list of areas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AreaResponse'
 */
router.get('/', getAllAreas);

/**
 * @swagger
 * /api/areas/{id}:
 *   get:
 *     summary: Get a single area by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single area object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaResponse'
 */
router.get('/:id', getAreaById);

/**
 * @swagger
 * /api/areas:
 *   post:
 *     summary: Create a new area
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AreaInput'
 *     responses:
 *       201:
 *         description: Area created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaResponse'
 */
router.post('/', createArea);

/**
 * @swagger
 * /api/areas/{id}:
 *   put:
 *     summary: Update an area by ID
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
 *             $ref: '#/components/schemas/AreaInput'
 *     responses:
 *       200:
 *         description: Area updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaResponse'
 */
router.put('/:id', updateArea);

/**
 * @swagger
 * /api/areas/{id}:
 *   delete:
 *     summary: Delete an area by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Area deleted successfully.
 */
router.delete('/:id', deleteArea);

module.exports = router;