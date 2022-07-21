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

module.exports = router;