const express = require('express');
const router = express.Router(); //register Route

const Product = require('../models/product');

const mongoose = require('mongoose');


router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id') //select fields you want to get
        .exec()
        .then(docs => {
            if (docs) {
                const response = {
                    count: docs.length,
                    products: docs.map(
                        doc => {
                            return {
                                name: doc.name,
                                price: doc.price,
                                _id: doc._id,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/products/' + doc.id
                                }
                            }
                        }
                    )
                }
                res.status(200).json({
                    response
                })

            } else {
                res.status(404).json({
                    message: "No data Found"
                })
            }
        });
});



router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created Product succesfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + result.id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//adding parametre to get
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                })
            } else {
                res.status(404).json({
                    message: "No valid Data found or id not found"
                })
            }
        }).
    catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id: id
    }, {
        $set: updateOps
    }).exec().then(result => {
        console.log('\n' + result + 'update')
        res.status(200).json({
            message: 'Product Updated',
            data: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        })
    }).catch(
        err => {
            console.log(err)
            res.status(500).json({
                message: err
            })
        }
    );
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log('Hello' + result)
            res.status(200).json({
                message: 'Product deleted',
                requests: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
                // deleted:result
            })
        })
        .catch(err => {
            console.log(err)
            req.status(500).json({
                error: err
            })

        })
});

//necessary for using route
module.exports = router;