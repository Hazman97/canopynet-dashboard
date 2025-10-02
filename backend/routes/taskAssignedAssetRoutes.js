const express = require('express');
const router = express.Router();
const { getAssetsByTaskId, createAssignment, deleteAssignment } = require('../controllers/taskAssignedAssetController');

// Add JSDoc comments for GET /task/{taskId}, POST /, and DELETE /{id}
// Use TaskAssetAssignmentInput and TaskAssetAssignmentResponse schemas

router.get('/task/:taskId', getAssetsByTaskId);
router.post('/', createAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;