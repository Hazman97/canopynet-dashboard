const express = require('express');
const router = express.Router();
const { getAllPhases, getPhaseById, createPhase, updatePhase, deletePhase } = require('../controllers/phaseController');

/**
 * @swagger
 * /api/phases:
 *   get:
 *     summary: Get a list of all phases
 *     responses:
 *       200:
 *         description: A list of phases.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PhaseResponse'
 */
router.get('/', getAllPhases);

/**
 * @swagger
 * /api/phases/{id}:
 *   get:
 *     summary: Get a single phase by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single phase object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhaseResponse'
 */
router.get('/:id', getPhaseById);

/**
 * @swagger
 * /api/phases:
 *   post:
 *     summary: Create a new phase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhaseInput'
 *     responses:
 *       201:
 *         description: Phase created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhaseResponse'
 */
router.post('/', createPhase);

/**
 * @swagger
 * /api/phases/{id}:
 *   put:
 *     summary: Update a phase by ID
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
 *             $ref: '#/components/schemas/PhaseInput'
 *     responses:
 *       200:
 *         description: Phase updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhaseResponse'
 */
router.put('/:id', updatePhase);

/**
 * @swagger
 * /api/phases/{id}:
 *   delete:
 *     summary: Delete a phase by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Phase deleted successfully.
 */
router.delete('/:id', deletePhase);

module.exports = router;