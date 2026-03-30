const express = require('express');
const { createAdmin, getAdmins, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const router = express.Router();

router.use(protect);
router.use(roleCheck('super_admin'));

router.post('/', createAdmin);
router.get('/', getAdmins);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;