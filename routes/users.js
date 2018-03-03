var express = require('express');
var router = express.Router();
var User = require('./../models/users')
var mongooses = require('mongoose')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", function (req,res,next) {
    var param = {
        "userName":req.body.userName,
        "userPwd": req.body.userPwd
    }
    User.findOne(param, function (err,doc) {
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
            if(doc){
                res.cookie("userId",doc.userId,{
                    path:'/',
                    maxAge:1000*60*60
                });
                res.cookie("userName",doc.userName,{
                    path:'/',
                    maxAge:1000*60*60
                });
                //req.session.user = doc;
                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        userName:doc.userName
                    }
                });
            } else {
                res.json({
                    status: '1',
                    msg: 'Wrong information'
                })
            }
        }
    });
});

//登出接口
router.post("/logout", function (req,res,next) {
    res.cookie("userId","",{
        path:"/",
        maxAge:-1
    });
    res.json({
        status:"0",
        msg:'',
        result:''
    })
});

router.get("/checkLogin", function (req,res,next) {
    if(req.cookies.userId){
        res.json({
            status:'0',
            msg:'',
            result:req.cookies.userName || ''
        });
    }else{
        res.json({
            status:'1',
            msg:'未登录',
            result:''
        });
    }
});

router.get('/cartList', function (req, res, next) {
    var userId = '10086'
    User.findOne({userId: userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            if (userDoc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: userDoc.cartList
                })
            }
        }
    })
})

router.post("/cartEdit", function (req,res,next) {
    var userId = '10086',
        name = req.body.name,
        num = req.body.num,
        checked = req.body.checked;
    User.update({"userId":userId,"cartList.name": name},{
        "cartList.$.num":num,
        "cartList.$.checked":checked,
    }, function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:'suc'
            });
        }
    })
});

router.post("/cartDel", function (req,res,next) {
    var userId = '10086'
    let name = req.body.name
    console.log(name)
    User.update({
        "userId":userId
    },{
        $pull:{
            "cartList":{
                "name": name
            }
        }
    }, function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:'suc'
            });
        }
    });
});

//查询用户地址接口
router.get("/infoList", function (req,res,next) {
    var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    addressList: doc.addressList,
                    orderList: doc.orderList}
            });
        }
    })
});

//删除地址接口
router.post("/delAddress", function (req,res,next) {
    var userId = req.cookies.userId,addressId = req.body.addressId;
    User.update({
        userId:userId
    },{
        $pull:{
            'addressList':{
                '_id':addressId
            }
        }
    }, function (err,doc) {
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:''
            });
        }
    });
});

router.post('/addAddress', function (req, res, next) {
    let userId = req.cookies.userId,
        addrString = req.body.addrString,
        addrUserName = req.body.addrUserName,
        addrTel = req.body.addrTel,
        addrPost = req.body.addrPost,
        addressId = req.body.addrId

    console.log('########## Begin addrId' + addressId)

    User.findOne({userId: userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (userDoc) {
                if (!addressId) {
                    console.log('############ !addressId' + addressId)
                    userDoc.addressList.push({
                        'userName': addrUserName,
                        'streetName': addrString,
                        'tel': addrTel,
                        'postCode': addrPost
                    })
                    userDoc.save(function (err2, doc2) {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'suc'
                            })
                        }
                    })
                } else {
                    console.log('########## addressId' + addrUserName)
                    console.log(User)
                    User.update({"userId": userId, "addressList._id": mongooses.Types.ObjectId(addressId)}, {
                        'addressList.$.userName': addrUserName,
                        'addressList.$.streetName': addrString,
                        'addressList.$.tel': addrTel,
                        'addressList.$.postCode': addrPost
                    }, function (err3, doc3) {
                        if(err3){
                            res.json({
                                status:'1',
                                msg:err3.message,
                                result:''
                            });
                        }else{
                            console.log('############# Doc3:')
                            console.log(doc3)
                            res.json({
                                status:'0',
                                msg:'',
                                result:'suc'
                            });
                        }
                    })
                }
            }
        }
    })
})

router.post('/addOrder', function (req, res, next) {
    let userId = req.cookies.userId,
        order = req.body.order

    console.log('##########3')
    console.log(order)

    User.findOne({'userId': userId},  function (err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            userDoc.orderList.push(order)
            userDoc.save(function (err2) {
                if (err2) {
                    res.json({
                        status: '1',
                        msg: err2.message
                    })
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: 'suc'
                    })
                }
            })
        }
    })
})

module.exports = router;
