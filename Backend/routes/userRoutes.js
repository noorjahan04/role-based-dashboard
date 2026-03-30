const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);
router.use(roleCheck('super_admin', 'admin'));

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;