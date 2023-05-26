require("dotenv").config();

const express = require("express");
const { connectDB } = require("./db/connect");

const {
  errorHandlerMiddleWare,
} = require("./middleware/errorHandlerMiddleWare");
const app = express();
const authRouter = require("./routes/User");
const productsRouter = require("./routes/Product");
const categoryRouter = require("./routes/Category");
const cartRouter = require("./routes/Cart");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const path = require("path");
const orderRouter = require("./routes/Order");
const payPalRouter = require("./routes/Payment");
const paypal = require("paypal-rest-sdk");
// json middlware
app.use(express.json());

// uploading files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// static files middleware
app.use(express.static("./public"));

// routes middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

// error handler middleware
app.use(errorHandlerMiddleWare);

// port number
const port = process.env.port || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening at port: ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
