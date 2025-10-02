const express = require('express');
const router = express.Router();
const { getAllUgvOperations, getUgvOperationById, createUgvOperation, updateUgvOperation, deleteUgvOperation } = require('../controllers/ugvOperationController');

/**
 * @swagger
 * /api/ugv-operations:
 *   get:
 *     summary: Get a list of all UGV operations
 *     responses:
 *       200:
 *         description: A list of UGV operations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UgvOperationResponse'
 */
router.get('/', getAllUgvOperations);

/**
 * @swagger
 * /api/ugv-operations/{id}:
 *   get:
 *     summary: Get a single UGV operation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single UGV operation object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UgvOperationResponse'
 */
router.get('/:id', getUgvOperationById);

/**
 * @swagger
 * /api/ugv-operations:
 *   post:
 *     summary: Create a new UGV operation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UgvOperationInput'
 *     responses:
 *       201:
 *         description: UGV operation created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UgvOperationResponse'
 */
router.post('/', createUgvOperation);

/**
 * @swagger
 * /api/ugv-operations/{id}:
 *   put:
 *     summary: Update a UGV operation by ID
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
 *             $ref: '#/components/schemas/UgvOperationInput'
 *     responses:
 *       200:
 *         description: UGV operation updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UgvOperationResponse'
 */
router.put('/:id', updateUgvOperation);

/**
 * @swagger
 * /api/ugv-operations/{id}:
 *   delete:
 *     summary: Delete a UGV operation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: UGV operation deleted successfully.
 */
router.delete('/:id', deleteUgvOperation);

module.exports = router;