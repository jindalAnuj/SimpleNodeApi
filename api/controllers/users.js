const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.get_all_user =  (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            if (docs) {
                const response = {
                    count: docs.length,
                    products: docs.map(
                        doc => {
                            return {
                                email: doc.email,
                                password: doc.password,
                                _id: doc._id,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/user/' + doc.id
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
}

exports.login_user = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (!result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              "secret",
              {
                  expiresIn: "1h"
              }
            )  ;
            return res.status(200).json({
              message: "Auth successful",
              token: token,
              result:result
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

// router.post('/login', (req, res, next) => {
//     User.find({
//             email: req.body.email
//         }).exec().then(user => {
//             if (user.length < 1) {
//                 return res.status(401).json({
//                     message: 'Auth failed',
//                     error :user.length
//                 })
//             }
//             bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//                 console.log(user.length+"==================="+user[0].password+" 88888 "+req.body.password);
                
//                 if (err) {
//                     return res.status(401).json({
//                         message: 'Auth failed',
//                         error:err
//                     })
//                 }
//                 if (!result) {
//                    const token= jwt.sign({
//                         email:user[0].email,
//                         userId:user[0]._id
//                     },process.env.JWT_KEY,
//                     {
//                         expiresIn:"1h"
//                     })
//                     return res.status(200).json({
//                         message: 'Auth Success',
//                         result:result, //bcrypt js not working
//                         token:token
//                     })
//                 }
//                 res.status(401).json({
//                     message: 'Auth failed',
//                     data:'hello',
//                     error:err,
//                     result:result,
                    
//                 })
//             })
//         })
//         .catch(err => {
//             console.log(err)
//             req.status(500).json({
//                 error: err
//             })
//         })
// })

exports.delete_user = (req, res, next) => {
    User.remove({
            _id: req.params.userId
        })
        .exec()
        .then((result) => {
        
                res.status(201).json({
                    message: 'Success'
                })
            
            
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.signup_user = (req, res, next) => {
    User.find({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            if (user.length >= 1) {
                return res.status(422).json({
                    message: 'Mail exists'
                })
            } else {
                bcrypt.hash(req.body.email, 8, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save().then((result) => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created',
                                data: result
                            })
                        }).catch((err) => {
                            console.log(err)
                            req.status(500).json({
                                error: err
                            })
                        });
                    }
                })
            }
        })
}