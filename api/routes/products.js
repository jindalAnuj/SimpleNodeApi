const express = require('express');
const router = express.Router(); //register Route

const multer = require('multer');
const checkauth = require('../middleware/check-auth')
const ProductController = require('../controllers/products');

//setting up the storage folder
const storage = multer.diskStorage({
    destination: function(req,file,cb)
    {
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
    cb(null,new Date().getUTCMilliseconds() + file.originalname)
    }
});

//accepting the specified like png and jpeg
const filefilter =(req,file,cb)=>{
    if(file.mimetype === 'image/jpeg'||file.mimetype ==='image/png')
    {cb(null,true);}
    else{
        cb(null,false);
    } 
}

//size should be less than 5 mb
const upload = multer({storage:storage,limits:{
    fileSize : 1024 * 1024 * 5
},
fileFilter:filefilter});//folder path for multer to store images

 //get all products 
router.get('/', ProductController.get_all_products);

//post single product
router.post("/",checkauth,upload.single('productImage'), ProductController.post_product);

//get product by id
router.get('/:productId', ProductController.get_product_by_id);

//update product with id and param value
router.patch('/:productId',checkauth, ProductController.update_product_by_id);

//delete product by id
router.delete('/:productId',checkauth,ProductController.delete_product_by_id);

//necessary for using route
module.exports = router;