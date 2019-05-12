var chai = require('chai');
var assert = chai.assert;    // Using Assert style
var expect = chai.expect;    // Using Expect style
var should = chai.should();  // Using Should style

const cartModel = require('../../models/cart');
const orderModel = require('../../models/order');
const productModel = require('../../models/product');
const cartItemModel = require('../../models/cart-item');
const orderItemModel = require('../../models/order-item');

const productFactory = require('../factories/product');
const userFactory = require('../factories/user');
const cartItemFactory = require('../factories/cartItem');
const orderItemFactory = require('../factories/orderItem');


describe('Testing', () => {
  let product;
  let cart;
  let order;
  let user;
  beforeEach(async () => {
    cart = await cartModel.create();
    order = await orderModel.create();
    product = await productFactory();
    user = await userFactory();
    cartItem = await cartItemFactory();
    orderItem = await orderItemFactory();
  });

  it('testing models creation', async () => {
    if (assert.isDefined(cart)) await cart.destroy();
    if (assert.isDefined(order)) await order.destroy()
    if (assert.isDefined(user)) await user.destroy()
    if (assert.isDefined(cartItem)) await cartItem.destroy()
    if (assert.isDefined(product)) await product.destroy()
  });

});