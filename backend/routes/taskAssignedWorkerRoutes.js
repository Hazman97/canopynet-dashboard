const express = require('express');
const router = express.Router();
const { getWorkersByTaskId, createAssignment, deleteAssignment } = require('../controllers/taskAssignedWorkerController');

// Add JSDoc comments for GET /task/{taskId}, POST /, and DELETE /{id}
// Use TaskWorkerAssignmentInput and TaskWorkerAssignmentResponse schemas

router.get('/task/:taskId', getWorkersByTaskId);
router.post('/', createAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;