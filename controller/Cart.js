const CustomAPIError = require("../errors/custom-error");
const { asyncWrapper } = require("../middleware/async");
const Cart = require("../models/Cart");
const Products = require("../models/Products");

const getCart = asyncWrapper(async (req, res) => {
  const cart = await Cart.find({ userId: req.user.userId });

  res.status(200).json({ cart, nbhits: cart.length });
});

const findProductInCart = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;

  const cartProduct = await Cart.findOne({
    productId: productId,
    userId: req.user.userId,
  });

  res.status(200).json({ cart: cartProduct });
});

const inCartPost = asyncWrapper(async (req, res) => {
  const { amount } = req.body;
  const { id: productId } = req.params;

  const product = await Products.find({
    _id: productId,
  });

  if (product[0].stock < 1) {
    throw new CustomAPIError(`Product out of stock`, 404);
  }

  const cart = await Cart.findOneAndUpdate(
    {
      productId: productId,
      userId: req.user.userId,
    },

    {
      quantity: parseInt(amount) + 1,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(cart);
});
const postCart = asyncWrapper(async (req, res) => {
  const { amount, productId } = req.body;

  const product = await Products.find({ _id: productId });

  if (product[0].stock < 1) {
    throw new CustomAPIError(`Product out of stock`, 404);
  }

  const cart = await Cart.create({
    userId: req.user.userId,
    productId: productId,
    quantity: amount,
  });

  res.status(201).json(cart);
});

const updateCart = asyncWrapper(async (req, res) => {
  const { cartId, productId, amount } = req.body;
  const product = await Products.find({ _id: productId });

  if (product[0].stock < 1 || product[0].stock < amount) {
    throw new CustomAPIError(`Product out of stock`, 404);
  }

  const cart = await Cart.findOneAndUpdate(
    { _id: cartId, productId: productId, userId: req.user.userId },

    { quantity: amount },

    { runValidators: true, new: true }
  );

  if (amount < 0) {
    throw new CustomAPIError(`Items must be in positive number`, 401);
  }
  if (amount == 0) {
    await Cart.findOneAndDelete({ _id: cartId, userId: req.user.userId });
    return res.status(200).send("");
  }

  if (!cart) {
    throw new CustomAPIError(`No cart item with id: ${cartId}`, 404);
  }
  res.status(200).json(cart);
});

const deleteCart = asyncWrapper(async (req, res) => {
  const { id: cartId } = req.body;

  const cart = await Cart.findOneAndDelete({
    _id: cartId,
    userId: req.user.userId,
  });

  if (!cart) {
    throw new CustomAPIError(`No cart item with id: ${cartId}`, 404);
  }
  res.status(200).json(`Cart item deleted successfully`);
});
module.exports = {
  getCart,
  postCart,
  deleteCart,
  updateCart,
  findProductInCart,
  inCartPost,
};
