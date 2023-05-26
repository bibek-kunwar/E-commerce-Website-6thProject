const CustomAPIError = require("../errors/custom-error");
const { asyncWrapper } = require("../middleware/async");
const Product = require("../models/Products");
const cloudinary = require("cloudinary");
const Cart = require("../models/Cart");

cloudinary.config({
  cloud_name: "dv9opmcjt",
  api_key: "633279916461984",
  api_secret: "T6xRsCp5mDOKY5n9qnUojrvG7tQ",
  secure: true,
});

const getProducts = asyncWrapper(async (req, res) => {
  const { name, category, price, fields } = req.query;

  const queryObject = {};

  if (name) {
    queryObject.p_name = { $regex: name, $options: "i" };
  }
  if (category) {
    queryObject.category = category;
  }

  const result = Product.find(queryObject);

  let limit = req.query.limit || 12;
  let page = req.query.page || 1;
  let pagination = (page - 1) * limit;

  let products = await result.skip(pagination).limit(limit);

  res.status(200).send({
    products: products,
    nbHits: products.length,
  });
});

const addProducts = asyncWrapper(async (req, res) => {
  if (req.user.role === "user") {
    return res.status(401).send("Cannot access this route");
  }
  let img = [];

  if (typeof req.body.img === "string") {
    img.push(req.body.img);
  } else {
    img = req.body.img;
  }

  const imageLinks = [];

  for (let i = 0; i < img.length; i++) {
    const result = await cloudinary.v2.uploader.upload(
      img[i],
      {
        folder: "poducts",
      },
      (err) => {
        console.log(err);
      }
    );

    imageLinks.push({ public_id: result.public_id, url: result.secure_url });
  }
  req.body.img = imageLinks;

  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

const getSingleProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomAPIError(`No product with id: ${productId}`, 404);
  }

  return res.status(200).json({ product });
});

const editProduct = async (req, res) => {
  if (req.user.role == "user") {
    return res.status(401).send("Cannot access this route");
  }

  let img = [];

  if (typeof req.body.img === "string") {
    img.push(req.body.img);
  } else {
    img = req.body.img;
  }

  const imageLinks = [];

  for (let i = 0; i < img.length; i++) {
    const result = await cloudinary.v2.uploader.upload(
      img[i],
      {
        folder: "products",
      },

      (err) => {
        console.log(err);
      }
    );
    imageLinks.push({ public_id: result.public_id, url: result.secure_url });
  }

  req.body.img = imageLinks;

  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomAPIError(`No product with id: ${productId}`, 404);
  }
  res.status(200).json(product);
};

const deleteProduct = asyncWrapper(async (req, res) => {
  if (req.user.role == "user") {
    throw new CustomAPIError("Cannot access this route", 401);
  }
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  const cart = await Cart.findOneAndDelete({ productId: productId });

  if (!product) {
    throw new CustomAPIError(`No product with id: ${productId}`, 404);
  }
  res.status(200).json(product);
});

const filterProductCategory = asyncWrapper(async (req, res) => {
  const { name } = req.params;

  const product = await Product.find({
    category: { $regex: name, $options: "i" },
  });
  if (!product) {
    throw new CustomAPIError(`No product with category: ${name}`, 404);
  }
  return res.status(400).json(product);
});

const addReview = asyncWrapper(async (req, res) => {
  const {
    body: { comment },
    params: { id },
  } = req;

  const review = {
    userId: req.user.userId,
    name: req.user.name,
    comment,
  };
  const product = await Product.findOne({ _id: id });

  if (!id) {
    throw new CustomAPIError(`No product with id: ${id}`, 404);
  }

  if (comment != " ") {
    product.review.push(review);
  } else {
    return res.status("Comment cannot be empty");
  }
  await Product.findOneAndUpdate({ _id: id }, product, {
    validateBeforeSvae: true,
    new: true,
  });
  res.status(200).json(product);
});

const getReview = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  console.log(productId);
  if (!productId) {
    throw new CustomAPIError(`No product with id: ${productId}`, 404);
  }

  return res.status(200).json(product);
});

const deleteReveiw = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!productId) {
    throw new CustomAPIError(`No product with id: ${productId}`, 404);
  }

  const { id: reviewId } = req.body;
  const review = product.review.find((rev) => rev.id == reviewId);
  console.log(req.body);
  if (!review) {
    throw new CustomAPIError(`No review with id: ${reviewId}`, 404);
  }
  product.review = product.review.filter((rev) => {
    if (rev.id != reviewId) {
      return product.review;
    }
  });

  await Product.findOneAndUpdate({ _id: productId }, product);
  res.status(200).json(product);
});

module.exports = {
  getProducts,
  addProducts,
  editProduct,
  deleteProduct,
  getSingleProduct,
  addReview,
  getReview,
  deleteReveiw,
  filterProductCategory,
};
