import categoryModel from '../models/category.model.js';
import cartModel from '../models/cart.model.js';

export default function (app) {
  app.use(async function (req, res, next) {

    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    if (req.session.auth === false) {
      req.session.cart = [];
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);

    next();
  });

  app.use(async function (req, res, next) {
    res.locals.lcCategories = await categoryModel.findAllWithDetails();
    // res.locals.lcCategories[1].isActive = 1;
    next();
  });
}