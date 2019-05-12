const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const productsCtrl = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

router.get('/add-product', isAuth, isAdmin, productsCtrl.getAddProduct);

router.get('/products', isAuth, isAdmin, productsCtrl.getAdminProducts);

router.get('/statistics', isAuth, isAdmin, productsCtrl.getAdminStatistics);

router.post('/add-product', isAuth, isAdmin, productsCtrl.postAddProduct);

router.get('/edit-product/:productId', isAuth, isAdmin, productsCtrl.getEditProduct)

router.post('/edit-product', isAuth, isAdmin, productsCtrl.postEditProduct)

router.post('/delete-product', isAuth, isAdmin, productsCtrl.postDeleteProduct)

module.exports = router;