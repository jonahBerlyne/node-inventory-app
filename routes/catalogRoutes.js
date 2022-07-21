const express = require('express');
const router = express.Router();

const {
 categories_list,
 create_category_get,
 create_category_post,
 category_detail,
 update_category_get,
 update_category_post,
 delete_category_get,
 delete_category_post
} = require('../controllers/categoryController');

const {
 items_list,
 create_item_get,
 create_item_post,
 item_detail,
 update_item_get,
 update_item_post,
 delete_item_get,
 delete_item_post
} = require('../controllers/itemController');

router.get('/', (req, res) => {
 res.render('index', { title: 'Inventory App' });
});

router.get('/categories', categories_list);
router.get('/category/create', create_category_get);
router.post('/category/create', create_category_post);
router.get('/category/:id', category_detail);
router.get('/category/:id/update', update_category_get);
router.post('/category/:id/update', update_category_post);
router.get('/category/:id/delete', delete_category_get);
router.post('/category/:id/delete', delete_category_post);

router.get('/items', items_list);
router.get('/item/create', create_item_get);
router.post('/item/create', create_item_post);
router.get('/item/:id', item_detail);
router.get('/item/:id/update', update_item_get);
router.post('/item/:id/update', update_item_post);
router.get('/item/:id/delete', delete_item_get);
router.post('/item/:id/delete', delete_item_post);

module.exports = router;