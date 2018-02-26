var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productsSchema = new Schema({
    "name": String,
    "price": Number,
    "categories": String
})

module.exports = mongoose.model('products', productsSchema, 'products')