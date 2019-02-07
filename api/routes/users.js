const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');


//get list of all users 
router.get('/', UserController.get_all_user);

//signup method 
router.post('/signup', UserController.signup_user)

//login request
router.post("/login", UserController.login_user)

//delete user by id
router.delete('/:userId', UserController.delete_user)

module.exports = router;