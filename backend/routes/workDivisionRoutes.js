const express = require('express');
const router = express.Router();
const { getAllWorkDivisions, getWorkDivisionById, createWorkDivision, updateWorkDivision, deleteWorkDivision } = require('../controllers/workDivisionController');

/**
 * @swagger
 * /api/work-divisions:
 *   get:
 *     summary: Get a list of all work divisions
 *     responses:
 *       200:
 *         description: A list of work divisions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkDivisionResponse'
 */
router.get('/', getAllWorkDivisions);

/**
 * @swagger
 * /api/work-divisions/{id}:
 *   get:
 *     summary: Get a single work division by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single work division object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkDivisionResponse'
 */
router.get('/:id', getWorkDivisionById);

/**
 * @swagger
 * /api/work-divisions:
 *   post:
 *     summary: Create a new work division
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkDivisionInput'
 *     responses:
 *       201:
 *         description: Work division created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkDivisionResponse'
 */
router.post('/', createWorkDivision);

/**
 * @swagger
 * /api/work-divisions/{id}:
 *   put:
 *     summary: Update a work division by ID
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
 *             $ref: '#/components/schemas/WorkDivisionInput'
 *     responses:
 *       200:
 *         description: Work division updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkDivisionResponse'
 */
router.put('/:id', updateWorkDivision);

/**
 * @swagger
 * /api/work-divisions/{id}:
 *   delete:
 *     summary: Delete a work division by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Work division deleted successfully.
 */
router.delete('/:id', deleteWorkDivision);

module.exports = router;