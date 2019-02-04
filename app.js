const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Configuration for CORS (Cross Origin Resource Sharing)
//So that our app will not crash at client side.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', 'Origin,X-Requested-With,Content-Type,Accept,Authrization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
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