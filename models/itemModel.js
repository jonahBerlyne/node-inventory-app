const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
 name: {
  type: String,
  required: true,
  minLength: 3,
  maxLength: 30
 },
 description: {
  type: String,
  required: true,
  minLength: 10,
  maxLength: 50
 },
 category: [{
  type: Schema.Types.ObjectId,
  ref: "Category",
  required: true
 }],
 price: {
  type: Number,
  required: true,
  minLength: 1,
  maxLength: 200
 },
 number_in_stock: {
  type: Number,
  required: true,
  minLength: 1,
  maxLength: 100
 }
});

ItemSchema.virtual("url").get(function () {
 return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);