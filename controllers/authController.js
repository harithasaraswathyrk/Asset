exports.showLoginForm = (req, res) => {
    res.render('auth/login', { error: null, showLayout: false });
  };
  
  exports.login = (req, res) => {
    const { email, password } = req.body;
  
    if (email === 'adminhari@gmail.com' && password === 'Hari@123') // admin email and password
    {
      req.session.isAdmin = true;
      return res.redirect('/');
    } else {
      return res.render('auth/login', { error: 'Invalid credentials!' });
    }
  };
  
  exports.logout = (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  };
  
  exports.isAuthenticated = (req, res, next) => {
    if (req.session.isAdmin) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  
