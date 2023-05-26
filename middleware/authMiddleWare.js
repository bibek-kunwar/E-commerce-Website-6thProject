const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const authenticationMiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("Not authorized to access this route", 400);
  }
  const token = authHeader.split(" ")[1];

  const { name, email, userId, role } = jwt.verify(
    token,
    process.env.JWT_SECRET
  );
  req.user = { name, email, userId, role, email };

  next();
};

module.exports = { authenticationMiddleWare };
