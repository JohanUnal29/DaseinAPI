import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ordersCollection = "orders";

const ordersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pendiente",
  },
  cart: [
    {
      _id: { type: String, required: true },
      title: { type: String, required: true },
      code: {type: String, required: true},
      thumbnails: {type: String, default: ''},
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

ordersSchema.plugin(mongoosePaginate);

const ordersModel = mongoose.model(ordersCollection, ordersSchema);

export default ordersModel;