const router = require('express').Router();
const { findAll, findById, create, update, remove } = require('../controllers/article');
const isLogin = require('../middlewares/isLogin');

router.get('/', findAll);
router.get('/:id', findById);
router.post('/', isLogin, create);
router.put('/:id', isLogin, update);
router.delete('/:id', isLogin, remove);

module.exports = router;