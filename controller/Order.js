const CustomAPIError = require("../errors/custom-error");
const { asyncWrapper } = require("../middleware/async");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

const addOrder = asyncWrapper(async (req, res) => {
  const {
    cartId,
    productId,
    quantity,
    email,
    phone,
    state,
    firstname,
    lastname,
    city,
  } = req.body;
  const { userId } = req.user;

  const product = await Product.find({ _id: productId });

  if (product[0].stock < 1) {
    throw new CustomAPIError("Product out of stock", 404);
  }

  if (product[0].stock < parseInt(quantity)) {
    throw new CustomAPIError(
      `Only ${product[0].stock} amount of product is available`,
      404
    );
  }

  let orders;
  const order = await Order.findOne({ productId: productId });

  if (quantity <= 0) {
    throw new CustomAPIError(
      "Please enter the quantity of the product to buy",
      400
    );
  }

  orders = await Order.create({
    productId: productId,
    userId: userId,
    cartId: cartId,
    quantity: quantity,
    email: email,
    phone: phone,
    state: state,
    firstname: firstname,
    lastname: lastname,
    city: city,
  });
  await Cart.findOneAndDelete({ userId: req.user.userId });

  let stock;
  if (orders) {
    if (quantity > 1) {
      stock = product[0].stock - parseInt(quantity);
    } else {
      stock = product[0].stock - 1;
    }
    await Product.findOneAndUpdate(
      { _id: productId },
      { stock: stock },
      { new: true, runValidators: true }
    );
  }

  res.status(201).json({ orders: orders });
});

const getOrder = asyncWrapper(async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId });

  res.status(200).json({ orders: orders, nbhits: orders.length });
});

const updateOrder = asyncWrapper(async (req, res) => {
  const {
    orderId,
    state,
    phone,
    email,
    firstname,
    lastname,
    city,
    status,
    method,
  } = req.body;

  const order = await Order.find({ _id: orderId, userId: req.user.userId });

  if (!order) {
    throw new CustomAPIError(`No order with id:${orderId}`, 404);
  }

  const orders = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      state: state,
      phone: phone,
      email: email,
      city: city,
      firstname: firstname,
      lastname: lastname,
      status: status,
      payment: method,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(orders);
});

const deleteOrder = asyncWrapper(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.find({ _id: orderId });

  if (!order) {
    throw new CustomAPIError(`No order with id:${orderId}`, 404);
  }

  await Order.findOneAndDelete({ _id: orderId });

  return res.status(200).send("Order deleted successfully");
});

const getSingleOrder = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw new CustomAPIError(`No order with id: ${orderId}`, 404);
  }
  return res.status(400).json({ order });
});

const getAllOrders = asyncWrapper(async (req, res) => {
  const orders = await Order.find({});
  return res.status(200).json({ orders });
});
module.exports = {
  addOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  getSingleOrder,
  getAllOrders,
};
