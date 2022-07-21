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
 category: {
  type: Schema.Types.ObjectId,
  ref: "Category",
  required: true
 },
 price: {
  type: Number,
  required: true,
  min: 1,
  max: 200
 },
 number_in_stock: {
  type: Number,
  required: true,
  min: 1,
  max: 100
 }
});

ItemSchema.virtual("url").get(function () {
 return `url goes here`;
});

module.exports = mongoose.model('Item', ItemSchema);