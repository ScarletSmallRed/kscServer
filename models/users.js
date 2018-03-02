var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "name": String,
            "price": Number,
            "categories": String,
            "num": Number,
            "checked": String
        }
    ],
    "addressList": [
        {
            "addressId": String,
            "userName": String,
            "streetName": String,
            "postCode": String,
            "tel": String
        }
    ]
});

module.exports = mongoose.model("users",userSchema, 'users');