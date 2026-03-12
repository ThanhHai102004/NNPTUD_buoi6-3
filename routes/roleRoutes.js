const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// CREATE
router.post('/', roleController.createRole);

// READ
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);

// UPDATE
router.put('/:id', roleController.updateRole);

// DELETE (soft delete)
router.delete('/:id', roleController.deleteRole);

module.exports = router;
