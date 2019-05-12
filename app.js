const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const errorCtrl = require('./controllers/errors')
const sequelize = require('./util/database');
const Product = require('./models/product');
const UserDetails = require('./models/userDetails');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const isAuth = require('./middleware/is-auth');
const session = require('express-session');

app.set('view engine', 'ejs')
app.set('views', 'views')


const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const clientRoute = require('./routes/client');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// app.use((req, res, next) => {
// User.findByPk(1)
// .then(user => {
//   req.user = user;
//   next();
// })
// .catch(err => console.log(err));
// });

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  })
);



app.use(authRoute);
app.use(clientRoute);
app.use('/admin', adminRoute);
app.use(shopRoute);

app.use(errorCtrl.get404);

// relations

User.hasMany(Product);
User.hasOne(Cart);
User.hasOne(UserDetails);
UserDetails.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem })
// use it when you want to overite db
// sequelize.sync({force: true}).then(
sequelize.sync().then(
  (result) => {
  app.listen(3000);
    // console.log(result);
  }
)
.catch(err => console.log(err)); 