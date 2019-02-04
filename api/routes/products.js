const express = require('express');
const router = express.Router(); //register Route

const Product = require('../models/product');

const mongoose = require('mongoose');


router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Handing GET requests to /products'
    // });
    Product.find().exec().then(doc => {
        if (doc.length > 0) {
            res.status(200).json({
                doc
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

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: product
    });
});

//adding parametre to get
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json(doc)
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
        console.log(result)
        res.status(200).json({
            result

        }).catch(
            err => {
                console.log(err)
                res.status(500).json({
                    message: err
                })
            }
        )
    });
    // res.status(200).json({
    //     message: 'Update product!'
    // });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            console.log(result)
            req.status(200).json({
                result
            })
        })
        .catch(err => {
            console.log(err)
            req.status(500).json({
                error: err
            })

        })
    res.status(200).json({
        message: 'Delete product!'
    });

});

//necessary for using route
module.exports = router;