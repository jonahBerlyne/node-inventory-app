const Category = require('../models/categoryModel');
const Item = require('../models/itemModel');
const async = require('async');
const { body, validationResult } = require('express-validator');

const categories_list = (req, res, next) => {
  Category.find()
          .sort([["name", "ascending"]])
          .exec(function (err, list_categories) {
           if (err) {
            return next(err);
           }

           res.render("categories_list", {
            title: "Categories List",
            categories_list: list_categories
           });
          });
}

const create_category_get = (req, res) => {
 res.render("category_form", {
  title: "Create",
  category: undefined,
  errors: undefined
 });
}

const create_category_post = [
 body('name')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Name must be specified.')
  .isAlphanumeric()
  .withMessage('Name has non-alphanumeric characters.'),
 body('description')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Description must be specified.')
  .isAlphanumeric()
  .withMessage('Description has non-alphanumeric characters.'),

 (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
   res.render('category_form', {
    title: 'Create',
    category: req.body,
    errors: errors.array()
   });
  } else {
   const category = new Category({
    name: req.body.name,
    description: req.body.description
   });
   category.save(function (err) {
    if (err) {
     return next(err);
    }
    res.redirect(category.url);
   });
  }
 }
];

const category_detail = (req, res, next) => {
 async.parallel(
   {
    category: function (callback) {
     Category.findById(req.params.id).exec(callback);
    },
    category_items: function (callback) {
     Item.find({ category: req.params.id }).exec(callback);
    }
  },
  function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
   }
   res.render("category_detail", {
    title: "Category Detail",
    category: results.category,
    category_items: results.category_items
   });
  }
 );
}

const update_category_get = (req, res, next) => {
 Category.findById(req.params.id)
         .exec(function (err, category) {
          if (err) {
           return next(err);
          }
          if (category === null) {
           err = new Error("Category not found");
           err.status = 404;
           return next(err);
          }
          res.render("update_category", {
           title: "Update Category",
           category,
           errors: undefined
          });
         });
}

const update_category_put = [
 body('name')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Name must be specified.')
  .isAlphanumeric()
  .withMessage('Name has non-alphanumeric characters.'),
 body('description')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Description must be specified.')
  .isAlphanumeric()
  .withMessage('Description has non-alphanumeric characters.'),

 (req, res, next) => {
  const errors = validationResult(req);

  const category = new Category({
   name: req.body.name,
   description: req.body.description,
   _id: req.params.id
  });

  if (!errors.isEmpty()) {
   res.render("update_category", {
    title: "Update",
    category,
    errors
   });
   return;
  } else {
   Category.findByIdAndUpdate(req.params.id, category, {}, function (err) {
    if (err) {
     return next(err);
    }
    res.redirect(category.url);
   });
  }
 }
];

const delete_category_get = (req, res, next) => {
 async.parallel(
  {
   category(callback) {
    Category.findById(req.params.id).exec(callback)
   },
   category_items(callback) {
    Item.find({ 'category': req.params.id }).exec(callback)
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.category === null) {
    res.redirect('/catalog/categories');
   }
   res.render('delete_category', {
    title: 'Delete',
    category: results.category,
    category_items: results.category_items
   });
  }
 );
}

const delete_category_delete = (req, res, next) => {
 async.parallel(
  {
   category(callback) {
    Category.findById(req.params.id).exec(callback)
   },
   category_items(callback) {
    Item.find({ 'category': req.params.id }).exec(callback)
   }
  }, function (err, results) {
   if (err) {
    return next(err);
   }
   if (results.category_items.length > 0) {
    res.render('delete_category', {
     title: 'Delete',
     category: results.category,
     category_items: results.category_items
    });
    return;
   } else {
    Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
     if (err) {
      return next(err);
     }
     res.redirect('/catalog/categories');
    });
   }
  }
 );
}

module.exports = {
 categories_list,
 create_category_get,
 create_category_post,
 category_detail,
 update_category_get,
 update_category_put,
 delete_category_get,
 delete_category_delete
}