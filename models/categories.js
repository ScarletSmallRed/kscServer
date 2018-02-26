var mongoose = require('mongoose')
var Schema = mongoose.Schema

var catigoriesSchema = new Schema({
    "seq": Number,
    "name": String
})

module.exports = mongoose.model('categories', catigoriesSchema,'categories')