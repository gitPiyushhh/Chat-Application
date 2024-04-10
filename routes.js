const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm || req.body.password,
    passwordChangedAt: req.body.passwordChangedAt || Date.now(),
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
}

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if user exists
  if (!email || !password) {
    return next(new AppError("Please provide the email and password", 400));
  }

  // 2. Match the credentails
  const user = await User.findOne({ email }).select("+password");

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
});
