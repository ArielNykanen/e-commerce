const Product = require('../models/product');
const UserDetails = require('../models/userDetails');
const Sales = require('../models/sales');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: "Add Products", 
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  })
}

exports.postAddProduct = async (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  const product = await Product.create({
    name: name,
    price: price,
    imageUrl: imageUrl,
    description: description
  });
  
  if (product) {
    console.log('Product Was Created!');
    res.status(200).redirect('/admin/products');
  } else {
    res.redirect('/admin/products');
  }
}

exports.postDeleteProduct = async (req, res, next) => {
  const deletedProductId = req.body.productId;
  const product = await Product.findByPk(deletedProductId);
  if (!product) {
    res.status(501).redirect('/admin/products');
  } else {
    await product.destroy();
    console.log("product was deleted successfuly!");
    res.status(200).redirect('/admin/products');
  }
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode){
    res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.findByPk(prodId);
  if (!product) {
    res.status(404).redirect('/admin/products');
  } else {
    res.status(200).render('admin/edit-product', {
      pageTitle: "Editing Product",
      path: '/admin/edit-product',
      prod: product,
      editing: editMode,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
    });
  }
   
}

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.name;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const product = await Product.findByPk(prodId)
  if (!product) {
    res.status(501).redirect('/admin/products');
  } else {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    await product.save();
    res.status(200).redirect('/admin/products');
  }
    console.log('Product was updated!');
}



exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.findAll()
    res.status(200).render('admin/products', {
      prods: products,
      pageTitle: "Admin Products",
      path: '/admin/products',
      hasProducts: products.length > 0,
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      });
}


exports.getAdminStatistics = async (req, res, next) => {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const topProducts = await Sales.findAll({
    where: {
      createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
    },
    order: [
      ['amountOfSales', 'DESC'],
    ],
    limit: 5
  })

  const topUsersByOrders = await UserDetails.findAll({
    where: {
      createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
    },
    order: [
      ['orders', 'DESC'],
    ],
    limit: 5
  })

  const topUsersByTotalSumOfOrders = await UserDetails.findAll({
    where: {
      createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
    },
    order: [
      ['totalOfOrders', 'DESC'],
    ],
    limit: 5
  })


  const monthlyAvgSales = await UserDetails.findAll({
    where: {
      createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
    }
  })

  let avgTotal = monthlyAvgSales.map(sales => {
    return sales.orders;
  })
    var now = new Date();
    let nowDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    avgTotal = Math.ceil(avgTotal / nowDate);
    console.log(avgTotal);
  
  res.status(200).render('admin/statistics', {
      topProducts: topProducts,
      topUsersByOrders: topUsersByOrders,
      topUsersByTotalSumOfOrders: topUsersByTotalSumOfOrders,
      avgTotal: avgTotal,
      pageTitle: "Admin Statistics",
      path: '/admin/statistics',
      isAuthenticated: req.session.isLoggedIn,
      isAdmin: req.session.isAdmin,
      });
}
