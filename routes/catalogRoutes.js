const express = require('express');
const router = express.Router();

const {
 categories_list,
 create_category_get,
 create_category_post,
 category_detail,
 update_category_get,
 update_category_put,
 delete_category_get,
 delete_category_delete
} = require('../controllers/categoryController');

const {
 item_list,
 create_item_get,
 create_item_post,
 item_detail,
 update_item_get,
 update_item_put,
 delete_item_get,
 delete_item_delete
} = require('../controllers/itemController');

router.get('/', (req, res) => {
 res.render('index', { title: 'Inventory App' });
});

router.get('/categories', categories_list);
router.get('/category/create', create_category_get);
router.post('/category/create', create_category_post);
router.get('/category/:id', category_detail);
router.get('/category/:id/update', update_category_get);
router.put('/category/:id/update', update_category_put);
router.get('/category/:id/delete', delete_category_get);
router.delete('/category/:id/delete', delete_category_delete);

router.get('/items', item_list);
router.get('/item/create', create_item_get);
router.post('item/create', create_item_post);
router.get('/item/:id', item_detail);
router.get('/item/:id/update', update_item_get);
router.put('/item/:id/update', update_item_put);
router.get('/item/:id/delete', delete_item_get);
router.delete('/item/:id/delete', delete_item_delete);

module.exports = router;