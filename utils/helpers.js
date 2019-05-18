const mongoose = require("mongoose");
const {
  Types: { ObjectId }
} = mongoose;

exports.validateObjectId = validateObjectId = id =>
  ObjectId.isValid(id) && new ObjectId(id).toString() === id;
