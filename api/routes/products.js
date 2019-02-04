const express = require('express');
const router = express.Router(); //register Route
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handing GET requests to /products'
    });
});



router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handing POST requests to /products',
        createProduct: product,
    });
});

//adding parametre to get
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

router.patch('/:productId', (req, res, next) => {

    res.status(200).json({
        message: 'Update product!'
    });

});

router.delete('/:productId', (req, res, next) => {

    res.status(200).json({
        message: 'Delete product!'
    });

});

//necessary for using route
module.exports = router;