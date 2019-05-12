const Product = require('../models/product');
const Cart = require('../models/product');
const User = require('../models/user');
const Sales = require('../models/sales');
const UserDetails = require('../models/userDetails');

exports.getCart = async (req, res, next) => {
  const user = await User.findByPk(req.session.user.id);

  user.getCart().then(
    cart => {
      return cart.getProducts();
    }).then(products => {
      res.render('shop/cart', {
        pageTitle: "In Cart",
        path: '/cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    }).catch(err => console.log(err))
}

exports.postCart = async (req, res, next) => {
  const user = await User.findByPk(req.session.user.id);
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  user.getCart().then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: { id: prodId } });
  })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err)
    );
}

exports.postCartDeleteItem = async (req, res, next) => {
  const user = await User.findByPk(req.session.user.id);

  const prodId = req.body.productId;
  user.getCart().then(cart => {
    return cart.getProducts({ where: { id: prodId } });
  })
    .then(products => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err)
    )
};




exports.postOrder = async (req, res, next) => {
  
  try {
    
    var today = new Date();
    const user = await User.findByPk(req.session.user.id);
    const cart = await user.getCart();
    const products = await cart.getProducts();
    const order = await user.createOrder();
    
    let totalSum = await Promise.all(products.map(async (prod) => { 
      return prod.cartItem.quantity * +prod.price;
    }));

    const ud = await user.getUserDetail();
    if (!ud) {
      await user.createUserDetail({
        userName: user.firstName,
        totalOfOrders: +totalSum,
        orders: 1,
      })
    } else {
      ud.update({
        totalOfOrders: ud.totalOfOrders += +totalSum,
        orders: ud.orders += 1,
      })
    }

    if (products.length > 1) {
      await Promise.all(products.map(async (prod) => {
        let sale = await Sales.findByPk(prod.id, {
          where: {
            createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
          }
        });

        if (!sale) {
          await Sales.create({
            productId: Number(prod.id),
            productName: prod.name,
            amountOfSales: prod.cartItem.quantity
          })
        } else {
          await sale.update({
            amountOfSales: sale.amountOfSales += prod.cartItem.quantity
          })
        }
      }));
    } else {
      let sale = await Sales.findByPk(products[0].id, {
        where: {
          createdAt: { gte: Date.UTC(today.getFullYear(), today.getMonth()) },
        }
      });

      if (!sale) {
        await Sales.create({
          productId: products[0].id,
          productName: products[0].name,
          amountOfSales: products[0].cartItem.quantity
        })
      } else {
        await sale.update({
          amountOfSales: sale.amountOfSales += products[0].cartItem.quantity
        })
      }
    }

    order.addProduct(products.map(product => {
      product.orderItem = { quantity: product.cartItem.quantity }
      return product;
    })).then(res => {
      return cart.setProducts(null);
    }).then(result => {
      res.redirect('/orders');
    })
  } catch (error) {
  }
}

exports.getOrders = async (req, res, next) => {
  const user = await User.findByPk(req.session.user.id);
  var moment = require('moment');
  user.getOrders({ include: ['products'] })
    .then(orders => {

      res.render('shop/orders', {
        pageTitle: "In Orders",
        path: '/orders',
        orders: orders,
        moment: moment,
        isAuthenticated: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin
      });
    }).catch(err => console.log(err)
    );
}
