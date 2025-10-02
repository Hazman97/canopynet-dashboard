const express = require('express');
const router = express.Router();
const { getAllLogs, getLogById, createLog, updateLog, deleteLog } = require('../controllers/logController');

/**
 * @swagger
 * /api/worker-logs:
 *   get:
 *     summary: Get a list of all daily logs, or filter by a specific worker
 *     parameters:
 *       - in: query
 *         name: workerId
 *         schema:
 *           type: integer
 *         description: The ID of the worker to filter logs by.
 *     responses:
 *       200:
 *         description: A list of worker logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkerLogResponse'
 */
router.get('/', getAllLogs);

/**
 * @swagger
 * /api/worker-logs/{id}:
 *   get:
 *     summary: Get a single daily log by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single worker log object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerLogResponse'
 *       404:
 *         description: Log not found.
 */
router.get('/:id', getLogById);

/**
 * @swagger
 * /api/worker-logs:
 *   post:
 *     summary: Create a new daily log for a worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerLogInput'
 *     responses:
 *       201:
 *         description: Daily log created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerLogResponse'
 *       409:
 *         description: Conflict. A log for this worker on this date already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createLog);

/**
 * @swagger
 * /api/worker-logs/{id}:
 *   put:
 *     summary: Update a daily log by its ID
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
 *             $ref: '#/components/schemas/WorkerLogInput'
 *     responses:
 *       200:
 *         description: Log updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkerLogResponse'
 *       404:
 *         description: Log not found.
 */
router.put('/:id', updateLog);

/**
 * @swagger
 * /api/worker-logs/{id}:
 *   delete:
 *     summary: Delete a daily log by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Log deleted successfully.
 *       404:
 *         description: Log not found.
 */
router.delete('/:id', deleteLog);

module.exports = router;