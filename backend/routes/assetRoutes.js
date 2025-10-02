const express = require('express');
const router = express.Router();
const { getAllAssets, getAssetById, createAsset, updateAsset, deleteAsset } = require('../controllers/assetController');

/**
 * @swagger
 * /api/assets:
 *   get:
 *     summary: Get a list of all assets
 *     responses:
 *       200:
 *         description: A list of assets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AssetResponse'
 */
router.get('/', getAllAssets);

/**
 * @swagger
 * /api/assets/{id}:
 *   get:
 *     summary: Get a single asset by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single asset object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetResponse'
 */
router.get('/:id', getAssetById);

/**
 * @swagger
 * /api/assets:
 *   post:
 *     summary: Create a new asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetInput'
 *     responses:
 *       201:
 *         description: Asset created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetResponse'
 */
router.post('/', createAsset);

/**
 * @swagger
 * /api/assets/{id}:
 *   put:
 *     summary: Update an asset by ID
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
 *             $ref: '#/components/schemas/AssetInput'
 *     responses:
 *       200:
 *         description: Asset updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssetResponse'
 */
router.put('/:id', updateAsset);

/**
 * @swagger
 * /api/assets/{id}:
 *   delete:
 *     summary: Delete an asset by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset deleted successfully.
 */
router.delete('/:id', deleteAsset);

module.exports = router;
