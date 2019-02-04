const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

//no rute here because want to recive ever error case
app.use((req,res,next)=>{
const error = new Error('Not Found');
error.status=404;
next(error);
}
);

//handle error if everything gets fails
app.use((error,req,res,next)=>{
res.status(error.status||500);
res.json({
 error :{
     message: error.message
 }
});
});

module.exports = app;