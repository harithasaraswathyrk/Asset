const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

router.get('/issues/add', issueController.showIssueForm);
router.post('/issues/add', issueController.issueAsset);
router.get('/issues/list', issueController.listIssuedAssets);
router.get('/issues/return/:id', issueController.returnAsset);

module.exports = router;
