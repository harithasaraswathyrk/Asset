const Asset = require('../models/asset');
const Category = require('../models/category');
const Employee = require('../models/employee');
const Issue = require('../models/issue');

// List Assets
exports.listAssets = async (req, res) => {
  const assets = await Asset.findAll({ include: [Category, Employee] });
  res.render('assets/list', { assets, showLayout: false });
};


// Show Add Asset Form
exports.showAddForm = async (req, res) => {
  const categories = await Category.findAll();
  const employees = await Employee.findAll();
  res.render('assets/form', { asset: null, categories, employees });
};

// Add Asset
exports.addAsset = async (req, res) => {
  const { name, categoryId, employeeId } = req.body;

  const asset = await Asset.create({
    name,
    CategoryId: categoryId,
    EmployeeId: employeeId || null,
    status: employeeId ? 'Issued' : 'Available'
  });

  const category = await Category.findByPk(categoryId);

  if (employeeId) {
    await Issue.create({
      EmployeeId: employeeId,
      AssetId: asset.id,
      issueDate: new Date(),
      status: 'Issued'
    });

    category.issuedQuantity += 1;
  } else {
    category.availableQuantity += 1;
  }

  await category.save();
  res.redirect('/assets');
};

// Show Edit Asset Form
exports.showEditForm = async (req, res) => {
  const asset = await Asset.findByPk(req.params.id);
  const categories = await Category.findAll();
  const employees = await Employee.findAll();
  res.render('assets/form', { asset, categories, employees });
};

// Update Asset
exports.updateAsset = async (req, res) => {
  const { name, categoryId, employeeId } = req.body;
  const asset = await Asset.findByPk(req.params.id);
  const oldEmployeeId = asset.EmployeeId;

  asset.name = name;
  asset.CategoryId = categoryId;
  asset.EmployeeId = employeeId || null;
  asset.status = employeeId ? 'Issued' : 'Available';
  await asset.save();

  const category = await Category.findByPk(categoryId);

  if (!oldEmployeeId && employeeId) {
    await Issue.create({
      EmployeeId: employeeId,
      AssetId: asset.id,
      issueDate: new Date(),
      status: 'Issued'
    });

    category.issuedQuantity += 1;
    category.availableQuantity = category.totalQuantity - category.issuedQuantity;
    await category.save();
  }

  res.redirect('/assets');
};

// Scrap Asset
exports.scrapAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).send('Asset not found');

    asset.status = 'Scrapped';
    await asset.save();

    const category = await Category.findByPk(asset.CategoryId);

    if (asset.EmployeeId) {
      category.issuedQuantity -= 1;
    } else {
      category.availableQuantity -= 1;
    }

    category.availableQuantity = Math.max(0, category.availableQuantity);
    category.issuedQuantity = Math.max(0, category.issuedQuantity);
    await category.save();

    console.log(`Asset ${asset.name} scrapped`);
    res.redirect('/assets');
  } catch (err) {
    console.error('Error scrapping asset:', err);
    res.status(500).send('Internal Server Error');
  }
};
