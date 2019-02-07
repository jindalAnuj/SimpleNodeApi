const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

const OrdersController = require('../controllers/orders');

//get all orders secured via api-key
router.get('/', checkAuth, OrdersController.order_get_all)

//post orders secured via api-key
router.post("/", checkAuth, OrdersController.order_post_product);

//get single orders by id secured via api-key
router.get('/:orderId', checkAuth, OrdersController.order_get_product);

//delete single orders by id secured via api-key
router.delete('/:orderId', checkAuth, OrdersController.order_delete_product);

module.exports = router;