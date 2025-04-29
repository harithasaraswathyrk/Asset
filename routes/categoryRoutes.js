const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.listCategories);
router.get('/categories/add', categoryController.showAddForm);
router.post('/categories/add', categoryController.addCategory);
router.get('/categories/edit/:id', categoryController.showEditForm);
router.post('/categories/edit/:id', categoryController.updateCategory);

module.exports = router;
