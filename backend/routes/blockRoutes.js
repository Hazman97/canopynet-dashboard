const express = require('express');
const router = express.Router();
const { getAllBlocks, getBlockById, createBlock, updateBlock, deleteBlock } = require('../controllers/blockController');

/**
 * @swagger
 * /api/blocks:
 *   get:
 *     summary: Get a list of all blocks
 *     responses:
 *       200:
 *         description: A list of blocks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlockResponse'
 */
router.get('/', getAllBlocks);

/**
 * @swagger
 * /api/blocks/{id}:
 *   get:
 *     summary: Get a single block by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single block object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockResponse'
 */
router.get('/:id', getBlockById);

/**
 * @swagger
 * /api/blocks:
 *   post:
 *     summary: Create a new block
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockInput'
 *     responses:
 *       201:
 *         description: Block created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockResponse'
 */
router.post('/', createBlock);

/**
 * @swagger
 * /api/blocks/{id}:
 *   put:
 *     summary: Update a block by ID
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
 *             $ref: '#/components/schemas/BlockInput'
 *     responses:
 *       200:
 *         description: Block updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlockResponse'
 */
router.put('/:id', updateBlock);

/**
 * @swagger
 * /api/blocks/{id}:
 *   delete:
 *     summary: Delete a block by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Block deleted successfully.
 */
router.delete('/:id', deleteBlock);

module.exports = router;