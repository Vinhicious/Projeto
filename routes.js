const express = require('express');
const router = express.Router();
const ctrl = require('./controllers');
const auth = require('./middleware');

router.post('/login', ctrl.login);
router.get('/produtos', ctrl.getProdutos);
router.post('/produtos', auth, ctrl.addProduto);
router.put('/produtos/:id', auth, ctrl.updateProduto);
router.delete('/produtos/:id', auth, ctrl.deleteProduto);

module.exports = router;
