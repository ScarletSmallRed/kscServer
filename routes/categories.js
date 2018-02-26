var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Categories = require('../models/categories')

mongoose.connect('mongodb://localhost:27017/ksc')

mongoose.connection.on("connected",function(){
    console.log("MongoDB connected success!!!")
})
mongoose.connection.on("error",function(){
    console.log("MongoDB connected fail!!!")
})
mongoose.connection.on("disconnected",function(){
    console.log("MongoDB connected disconnected!!!")
})

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a categories');
});

module.exports = router;

router.get('/list', function (req, res, next) {
    let params = {}
    Categories.find(params, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: 'suc',
                result: {
                    list: doc
                }
            })
        }
    })
})