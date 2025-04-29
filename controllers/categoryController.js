const Category = require('../models/category');

// List Categories
exports.listCategories = async (req, res) => {
  const categories = await Category.findAll();
  res.render('categories/list', { categories, showLayout: false });
};


// Show Add Category Form
exports.showAddForm = (req, res) => {
  res.render('categories/form', { category: null });
};

// Add Category
exports.addCategory = async (req, res) => {
  const { name, totalQuantity } = req.body;
  await Category.create({
    name,
    totalQuantity: parseInt(totalQuantity, 10), 
    issuedQuantity: 0
  });
  res.redirect('/categories');
};

// Show Edit Category Form
exports.showEditForm = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  res.render('categories/form', { category });
};

// Update Category
exports.updateCategory = async (req, res) => {
  const { name, totalQuantity } = req.body;
  const category = await Category.findByPk(req.params.id);

  if (!category) return res.status(404).send('Category not found');

  category.name = name;
  category.totalQuantity = parseInt(totalQuantity, 10); // 🔥 Important: convert to number
  await category.save();

  res.redirect('/categories');
};
