const Asset = require('../models/asset');
const Category = require('../models/category');
const Issue = require('../models/issue');

exports.showReport = async (req, res) => {
  const totalAssets = await Asset.count();
  const availableAssets = await Asset.count({ where: { status: 'Available' } });
  const scrappedAssets = await Asset.count({ where: { status: 'Scrapped' } });
  const issuedAssets = await Issue.count({ where: { status: 'Issued' } });

  const categories = await Category.findAll({
    include: [Asset]
  });

  const categorySummary = categories.map(cat => {
    const assets = cat.Assets || [];
    const total = assets.length;
    const available = assets.filter(a => a.status === 'Available').length;
    const issued = assets.filter(a => a.status === 'Issued').length;
    const scrapped = assets.filter(a => a.status === 'Scrapped').length;

    return {
      name: cat.name,
      total,
      available,
      issued,
      scrapped
    };
  });

  res.render('report/stock', {
    showLayout: false,
    totalAssets,
    availableAssets,
    scrappedAssets,
    issuedAssets,
    categorySummary
  });
};
