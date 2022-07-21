const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');
const async = require('async');
const { body, validationResult } = require('express-validator');

const item_list = (req, res, next) => {
 Item.find({}, 'name category')
     .sort({ name: 1 })
     .populate('category')
     .exec(function (err, list_items) {
      if (err) {
       return next(err);
      }
      res.render('item_list', {
       title: 'Item List',
       item_list: list_items
      });
     });
}

const create_item_get = (req, res, next) => {
 async.parallel(
  {
   categories(callback) {
    Category.find(callback);
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   res.render('item_form', {
    title: 'Create',
    categories: results.categories,
    item: undefined,
    errors: undefined 
   });
  }
 );
}

const create_item_post = (req, res, next) => [
 (req, res, next) => {
  if (!(req.body.category instanceof Array)) {
   if (typeof req.body.category === "undefined") {
    req.body.category = [];
   } else {
    req.body.category = new Array(req.body.category);
   }
  }
  next();
 },

 body("name", "Name is empty.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("description", "Description is empty.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("category.*").escape(),
 body("price", "Price is $0.00.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("number_in_stock", "Number in stock is 0.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 
 (req, res, next) => {
  const errors = validationResult(req);

  const item = new Item({
   name: req.body.name,
   description: req.body.description,
   category: req.body.category,
   price: req.body.price,
   number_in_stock: req.body.number_in_stock
  });

  if (!errors.isEmpty()) {
   async.parallel(
    {
     categories: function(callback) {
      Category.find(callback);
     }
    }, function (err, results) {
     if (err) {
      return next(err);
     }
     for (let i = 0; i < results.category.length; i++) {
      if (item.category.indexOf(results.categories[i]._id > -1)) {
       results.categories[i].checked = "true";
      }
     }
     res.render("item_form", {
      title: "Create",
      categories: results.categories,
      item,
      errors: errors.array()
     });
     return;
    }
   );
  } else {
   item.save(function (err) {
    if (err) {
     return next(err);
    }
    res.redirect(item.url);
   });
  }
 }
];

const item_detail = (req, res, next) => {
 async.parallel(
  {
   item: function(callback) {
    Item.findById(req.params.id)
        .populate("category")
        .exec(callback);
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.item === null) {
    err = new Error("Item not found");
    err.status = 404;
    return next(err);
   }
   res.render("item_detail", {
    title: results.item.name,
    item: results.item
   });
  }
 );
}

const update_item_get = (req, res, next) => {
 async.parallel(
  {
   item(callback) {
    Item.findById(req.params.id)
        .populate('category')
        .exec(callback);
   },
   categories(callback) {
    Category.find(callback);
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.item === null) {
    err = new Error('Item not found');
    err.status = 404;
    return next(err);
   }
   for (let i = 0; i < results.categories.length; i++) {
    for (let j = 0; j < results.item.category.length; j++) {
     if (results.categories[i]._id.toString() === results.item.category[j]._id.toString()) {
      results.categories[i].checked = 'true';
     }
    }
   }
   res.render('update_item', {
    title: "Update",
    categories: results.categories,
    item: results.item,
    errors: undefined 
   });
  }
 );
}

const update_item_put = [
 (req, res, next) => {
  if (!(Array.isArray(req.body.category))) {
   if (typeof req.body.category === "undefined") {
    req.body.category = [];
   } else {
    req.body.category = [req.body.category];
   }
  }
  next();
 },

 body("name", "Name is empty.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("description", "Description is empty.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("category.*").escape(),
 body("price", "Price is $0.00.")
     .trim()
     .isLength({ min: 1 })
     .escape(),
 body("number_in_stock", "Number in stock is 0.")
     .trim()
     .isLength({ min: 1 })
     .escape(),

 (req, res, next) => {
  const errors = validationResult(req);

  const item = new Item({
   name: req.body.name,
   description: req.body.description,
   category: (typeof req.body.category === 'undefined') ? [] : req.body.category,
   price: req.body.price,
   number_in_stock: req.body.number_in_stock
  });

  if (!errors.isEmpty()) {
   async.parallel(
    {
     categories(callback) {
      Category.find(callback);
     }
    }, function (err, results) {
     if (err) {
      return next(err);
     }
     for (let i = 0; i < results.categories.length; i++) {
      if (item.category.indexOf(results.categories[i]._id) > -1) {
       results.categories[i].checked = 'true';
      }
     }
     res.render('update_item', {
      title: 'Update',
      categories: results.categories,
      item,
      errors: errors.array()
     });
    }
   );
   return;
  } else {
   Item.findByIdAndUpdate(req.params.id, item, {}, function (err, _item) {
    if (err) {
     return next(err);
    }
    res.redirect(_item.url);
   });
  }
 }
];

const delete_item_get = (req, res, next) => {
 async.parallel(
  {
   item: function (callback) {
    Item.findById(req.params.id)
        .populate("category")
        .exec(callback);
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.item === null) {
    err = new Error("Item not found");
    err.status = 404;
    return next(err);
   }
   res.render("delete_item", {
    title: "Delete",
    item: results.item 
   });
  }
 );
}

const delete_item_delete = (req, res, next, err) => {
 if (err) {
  return next(err);
 }
 Item.findByIdAndRemove(req.body.itemid, function (err) {
  if (err) {
   return next(err);
  }
  res.redirect("/catalog/items");
 });
}

module.exports = {
 item_list,
 create_item_get,
 create_item_post,
 item_detail,
 update_item_get,
 update_item_put,
 delete_item_get,
 delete_item_delete
}