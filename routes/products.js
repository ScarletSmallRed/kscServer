var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Products = require('../models/products')

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
    let category = req.param('category')
    let params = {}
    let isPriceUp = req.param('isPriceUp')
    let search = req.param('search')

    if (search != '') {
        params = {
            name: search
        }
    } else {
        if (category != 'all') {
            params = {
                categories: category
            }
        } else {
            params = {}
        }
    }

    Products.find(params).sort({'price': isPriceUp}).exec(
        function (err, doc) {
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
                        count: doc.length,
                        list: doc
                    }
                })
            }
        })
})