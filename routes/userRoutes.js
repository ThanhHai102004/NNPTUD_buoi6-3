const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CREATE
router.post('/', userController.createUser);

// READ
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// UPDATE
router.put('/:id', userController.updateUser);

// DELETE (soft delete)
router.delete('/:id', userController.deleteUser);

// ENABLE - Kích hoạt user
router.post('/enable', userController.enableUser);

// DISABLE - Vô hiệu hóa user
router.post('/disable', userController.disableUser);

module.exports = router;
