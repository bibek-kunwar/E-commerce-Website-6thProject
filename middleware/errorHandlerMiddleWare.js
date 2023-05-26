const CustomAPIError = require("../errors/custom-error");

const errorHandlerMiddleWare = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log(err);
  return res.status(500).json(err.message);
};

module.exports = { errorHandlerMiddleWare };
