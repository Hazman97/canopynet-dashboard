const express = require('express');
const router = express.Router();
const { getAllWorkers, getWorkerById, createWorker, updateWorker, deleteWorker } = require('../controllers/workerController');

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Get a list of all workers
 *     responses:
 *       200:
 *         description: A list of workers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkerResponse'
 */
router.get('/', getAllWorkers);

/**
 * @swagger
 * /api/workers/{id}:
 *   get:
 *     summary: Get a single worker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single worker object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponse'
 */
router.get('/:id', getWorkerById);

/**
 * @swagger
 * /api/workers:
 *   post:
 *     summary: Create a new worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerInput'
 *     responses:
 *       201:
 *         description: Worker created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponse'
 */
router.post('/', createWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   put:
 *     summary: Update a worker by ID
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
 *             $ref: '#/components/schemas/WorkerInput'
 *     responses:
 *       200:
 *         description: Worker updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerResponse'
 */
router.put('/:id', updateWorker);

/**
 * @swagger
 * /api/workers/{id}:
 *   delete:
 *     summary: Delete a worker by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Worker deleted successfully.
 */
router.delete('/:id', deleteWorker);

module.exports = router;