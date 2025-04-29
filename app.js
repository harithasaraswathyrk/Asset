// 1. Import libraries
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./controllers/authController');

// 2. Import models
const Employee = require('./models/employee');
const Asset = require('./models/asset');
const Issue = require('./models/issue');
const Category = require('./models/category');

// 3. Define associations
Asset.belongsTo(Category);
Asset.belongsTo(Employee);
Category.hasMany(Asset);
Employee.hasMany(Asset);
Issue.belongsTo(Employee);
Issue.belongsTo(Asset);
Asset.hasMany(Issue);
Employee.hasMany(Issue);

// 4. Create the app
const app = express();

// 5. Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'super-secret-session-key',
  resave: false,
  saveUninitialized: true
}));

// 6. Auth routes (no layout needed)
app.use(authRoutes);

// 7. Protected routes
const employeeRoutes = require('./routes/employeeRoutes');
const assetRoutes = require('./routes/assetRoutes');
const issueRoutes = require('./routes/issueRoutes');
const reportRoutes = require('./routes/reportRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use(isAuthenticated);
app.use('/', employeeRoutes);
app.use('/', assetRoutes);
app.use('/', issueRoutes);
app.use('/', reportRoutes);
app.use('/', categoryRoutes);

// 8. Homepage with layout ON
app.get('/', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.findAll();

    const categorySummary = await Promise.all(
      categories.map(async (cat) => {
        const total = cat.totalQuantity;
        const issued = cat.issuedQuantity || 0;
        const available = total - issued;
        const scrapped = await Asset.count({ where: { CategoryId: cat.id, status: 'Scrapped' } });

        return {
          name: cat.name,
          total,
          issued,
          available,
          scrapped
        };
      })
    );

    const totalAssets = categorySummary.reduce((sum, c) => sum + c.total, 0);
    const availableAssets = categorySummary.reduce((sum, c) => sum + c.available, 0);
    const issuedAssets = categorySummary.reduce((sum, c) => sum + c.issued, 0);
    const scrappedAssets = categorySummary.reduce((sum, c) => sum + c.scrapped, 0);

    res.render('home', {
      showLayout: true,
      categorySummary,
      totalAssets,
      availableAssets,
      issuedAssets,
      scrappedAssets
    });
  } catch (err) {
    console.error('Home page error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 9. Sync DB
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => console.error('Database sync failed:', err));
