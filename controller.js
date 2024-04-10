const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: ".env",
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm || req.body.password,
    passwordChangedAt: req.body.passwordChangedAt || Date.now(),
  };

  /* 
    Validations and error handling
  */
  if (!email || !password || !passwordConfirm) {
    console.error("Please provide all details");
    res.status(400).json({
      status: "failure",
      data: {
        message: "Please provide all details",
      },
    });
    return;
  }

  if (password !== passwordConfirm) {
    console.error("Password and confirm password not match");
    res.status(400).json({
      status: "failure",
      data: {
        message: "Password and confirm password not match",
      },
    });
    return;
  }

  if (
    password?.length < 8 ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(password) ||
    !/[A-Z]/.test(password)
  ) {
    console.error(
      "Password should be 8 chars long with one special character and one capital letter"
    );
    res.status(400).json({
      status: "failure",
      data: {
        message:
          "Password should be 8 chars long with one special character and one capital letter",
      },
    });
    return;
  }

  /* 
   Logic to save data in db
  */

  /* 
    Token sign and pass to db  
  */
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  if (!email || !password) {
    return next(new Error("Please provide the email and password", 400));
  }

  /* 
    Validations and error handling
  */
  if (!email || !password || !passwordConfirm) {
    console.error("Please provide all details");
    res.status(400).json({
      status: "failure",
      data: {
        message: "Please provide all details",
      },
    });
    return;
  }

  if (password !== passwordConfirm) {
    console.error("Password and confirm password not match");
    res.status(400).json({
      status: "failure",
      data: {
        message: "Password and confirm password not match",
      },
    });
    return;
  }

  // 2. Match the credentails
  // const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. Send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
};
