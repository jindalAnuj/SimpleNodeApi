const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://anujjindal121:' 
    + process.env.MONGO_ATLAS_PW 
    + '@node-rest-shop-shard-00-00-iho4n.mongodb.net:27017,node-rest-shop-shard-00-01-iho4n.mongodb.net:27017,node-rest-shop-shard-00-02-iho4n.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true', {
    useMongoClient: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Configuration for CORS (Cross Origin Resource Sharing)
//So that our app will not crash at client side.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//no rute here because want to recive ever error case
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//handle error if everything gets fails
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;