const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { asyncWrapper } = require("../middleware/async");
const CustomAPIError = require("../errors/custom-error");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  const users = await User.create({ name, email, password });
  const payload = { email: users.email, name: users.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  if (!email || !password || !name) {
    throw new CustomAPIError("All the fields are required", 401);
  }
  res.status(201).json({ success: true, users, token });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomAPIError("Please provide valid credentials", 401);
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomAPIError("Please provide valid credentials", 401);
  }

  const isMatchedPassword = await user.compareHash(password);

  if (!isMatchedPassword) {
    throw new CustomAPIError("Password do not match", 400);
  }
  const token = await user.createToken();

  res.status(200).json({
    token: token,
    role: user.role,
    name: user.name,
    id: user._id,
    email: user.email,
  });
});

const forgotPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  // checking whether user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error(`User ${email} doesn't exist`, 401);
  }

  // creating one time link
  const secret = process.env.JWT_SECRET + user.password;

  const payload = { email: user.email, id: user._id };
  const token = jwt.sign(payload, secret, { expiresIn: "15min" });
  const link = `http://localhost:3000/api/v1/auth/reset-password/${user._id}/${token}`;

  // sending link to the email
  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: user.email,
    subject: "Password recovery email ",
    text: `${link}
    Click on the link to recover your password.The link will expire in 15mins
    `,
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  res.send(`Password reset link has been sent to email ${user.email}`);
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findOne({ _id: id });
  // check if this id exists
  if (!user) {
    throw new Error(`Invalid user`);
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.send(`
    <html>
    <head>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    </head>
    <body>
    <form action="" class="reset-password">
    <label for="">Password</label>
    <input type="password" class="re-password" />
    <br />
    <br />
    <label for="">Confirm-Password</label>
    <input type="password" class="confirm-password" />
    <br />
    <br />
    <button type="Submit">Submit</button>
  </form>

  <script>
  const resetPasswordForm = document.querySelector(".reset-password");
const urlLocation=window.location.href.split("/")
const id=urlLocation[urlLocation.length-2]
const token=urlLocation[urlLocation.length-1];

console.log(id,token)

const password=document.querySelector(".re-password")
const confirmPassword=document.querySelector(".confirm-password")

  resetPasswordForm.addEventListener("submit", async (e) => {
    console.log(password.value)
    console.log(confirmPassword.value)

    e.preventDefault()
    const { data } = await axios.post("http://localhost:3000/api/v1/auth/reset-password/${id}/${token}",{
      password:password.value,
      confrimPassword:confirmPassword.value
    });
    console.log(data)
  });
  
  console.log("hello");
  </script>
  </body>
    `);
  } catch (err) {
    console.log(err);
  }
});

const userResetPassword = asyncWrapper(async (req, res) => {
  try {
    const { password, confrimPassword } = req.body;

    const { id, token } = req.params;

    const user = await User.findOne({ _id: id });
    if (password == "" || confrimPassword == "") {
      throw new CustomAPIError("Please enter a password", 401);
    }

    if (password !== confrimPassword) {
      throw new CustomAPIError("Password donot match", 401);
    }

    if (password.length < 6) {
      throw new CustomAPIError("Password must be greater than 6 characters");
    }
    const userPassword = await User.findOne({ _id: id });

    if (!userPassword) {
      throw new Error("User does not exit", 401);
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      const payload = jwt.verify(token, secret);

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const updatePassword = await User.findOneAndUpdate(
        { _id: id },
        { password: hashPassword },
        {
          new: true,
          runValidators: true,
        }
      );
      res.redirect("http://localhost:3000/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
    res.send(err);
    throw new CustomAPIError("Cannot get link", 400);
  }
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOneAndDelete({ _id: userId });
  if (!user) {
    throw new CustomAPIError(`No user with id ${userId}`, 404);
  }

  res.status(200).json("User deleted successfully");
});

const editUser = asyncWrapper(async (req, res) => {
  const { id: userId } = req.params;
  const { name, email, password, confrimPassword } = req.body;

  if (name == "" || email == "" || password == "" || confrimPassword == "") {
    throw new CustomAPIError("Fields cannot be empty", 401);
  }

  if (password == confrimPassword) {
    throw new CustomAPIError("Password do not match", 401);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      name: name,
      email: email,
      password: hashPassword,
      confrimPassword: confrimPassword,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  if (!user) {
    throw new CustomAPIError(`No user with id ${userId}`, 404);
  }
  res.status(200).json("User edited successfully");
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  userResetPassword,
  deleteUser,
  editUser,
};
