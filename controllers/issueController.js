const Issue = require('../models/issue');
const Asset = require('../models/asset');
const Employee = require('../models/employee');
const Category = require('../models/category');

// Show Issue Form
exports.showIssueForm = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const assets = await Asset.findAll({ where: { status: 'Available' } });

    res.render('issues/form', { employees, assets });
  } catch (error) {
    console.error('Error loading form:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Handle Issue Submission
exports.issueAsset = async (req, res) => {
  try {
    const { employeeId, assetId, issueDate } = req.body;
    const asset = await Asset.findByPk(assetId, { include: Category });

    if (!asset || asset.status !== 'Available') {
      return res.status(400).send("Asset not available to issue.");
    }

    await Issue.create({
      EmployeeId: employeeId,
      AssetId: asset.id,
      issueDate,
      status: 'Issued'
    });

    asset.status = 'Issued';
    asset.EmployeeId = employeeId;
    await asset.save();

    const category = asset.Category;
    category.issuedQuantity += 1;
    category.availableQuantity -= 1;
    await category.save();

    res.redirect('/issues/list');
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to issue asset.");
  }
};

// List Issues
exports.listIssuedAssets = async (req, res) => {
  try {
    const issues = await Issue.findAll({
      include: [
        { model: Asset, attributes: ['name'] },
        { model: Employee, attributes: ['name'] }
      ]
    });

    res.render('issues/list', { issues, showLayout: false });
  } catch (err) {
    console.error('Failed to load issued assets:', err);
    res.status(500).send('Server Error');
  }
};

// Handle Return Asset
exports.returnAsset = async (req, res) => {
  try {
    const issue = await Issue.findByPk(req.params.id, {
      include: [{ model: Asset, include: [Category] }]
    });

    if (!issue) return res.status(404).send('Issue not found');

    issue.status = 'Returned';
    await issue.save();

    const asset = issue.Asset;
    asset.status = 'Available';
    asset.EmployeeId = null;
    await asset.save();

    const category = asset.Category;
    if (category.issuedQuantity > 0) {
      category.issuedQuantity -= 1;
      category.availableQuantity += 1;
      await category.save();
    }

    res.redirect('/issues/list');
  } catch (err) {
    console.error('Return asset error:', err);
    res.status(500).send('Failed to return asset');
  }
};
