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
        if (category != '全部') {
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

router.post('/addCart', function (req, res, next) {
    var userId = '10086'
    var productName = req.body.productName

    var User = require('../models/users')
    User.findOne({userId: userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if(userDoc){
                var goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if(item.name == productName){
                        goodsItem = item;
                        item.num ++;
                    }
                });
                if(goodsItem){
                    userDoc.save(function (err2,doc2) {
                        if(err2){
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'suc'
                            })
                        }
                    })
                }else{
                    Products.findOne({name: productName}, function (err1,doc) {
                        console.log('##########')
                        console.log(doc)
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err1.message
                            })
                        }else{
                            if(doc){
                                doc.num = 1;
                                doc.checked = '1';
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2,doc2) {
                                    if(err2){
                                        res.json({
                                            status:"1",
                                            msg:err2.message
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:'suc'
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        }
    })
})