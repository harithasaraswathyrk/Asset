const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/assets', assetController.listAssets);
router.get('/assets/add', assetController.showAddForm);
router.post('/assets/add', assetController.addAsset);
router.get('/assets/edit/:id', assetController.showEditForm);
router.post('/assets/edit/:id', assetController.updateAsset);
router.get('/assets/scrap/:id', assetController.scrapAsset); 

module.exports = router;
