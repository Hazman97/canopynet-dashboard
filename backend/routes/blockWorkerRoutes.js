const express = require('express');
const router = express.Router();
const { getAssignmentsByBlockId, createAssignment, deleteAssignment } = require('../controllers/blockWorkerController');

/**
 * @swagger
 * /api/block-workers/block/{blockId}:
 *   get:
 *     summary: Get all workers assigned to a specific block
 *     parameters: [{ in: path, name: blockId, required: true, schema: { type: 'integer' }}]
 *     responses: { 200: { description: 'A list of worker assignments.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BlockWorkerAssignmentResponse' }}}}}}
 */
router.get('/block/:blockId', getAssignmentsByBlockId);

/**
 * @swagger
 * /api/block-workers:
 *   post:
 *     summary: Assign a worker to a block
 *     requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BlockWorkerAssignmentInput' }}}}
 *     responses: { 201: { description: 'Assignment created successfully.', content: { 'application/json': { schema: { $ref: '#/components/schemas/BlockWorkerAssignmentResponse' }}}}}
 */
router.post('/', createAssignment);

/**
 * @swagger
 * /api/block-workers/{id}:
 *   delete:
 *     summary: Unassign a worker from a block
 *     parameters: [{ in: path, name: id, required: true, schema: { type: 'integer' }}]
 *     responses: { 200: { description: 'Assignment deleted successfully.' }}
 */
router.delete('/:id', deleteAssignment);

module.exports = router;