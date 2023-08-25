import User from "../models/userModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Create User Account
// @route   POST '/api/user'
// @access  public
const createUserAccount = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new Error('Password and Confirm Password are not the same');
  }

  // Check for user if already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({
      error: {
        message: 'User already exists'
      }
    });
    throw new Error('User Already exists');
  }

  // Create User account
  const registerUser = await User.create({ name, email, password });
  if (registerUser) {
    generateToken(res, registerUser._id);

    res.status(201).json({
      _id: registerUser._id,
      email: registerUser.email,
      name: registerUser.name,
    });
  } else {
    res.status(400);
    throw new Error('Invalid User Data');
  }
});


// @desc    Login User
// @route   POST '/api/user/login'
// @access  public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  // If user has no account
  if (!user) {
    throw new Error(`User not found with email ${ email }`);
  }

  // If user exist check password
  if (user && await user.matchPassword(password, user.password)) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } else {
    req.status(401);
    throw new Error('Invalid Email or Password');
  }
});

// @desc    Logout User
// @route   POST '/api/users/logout'
// @access  Private
const logOutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expiresIn: new Date(0),
  });
  res.status(200).json({
    message: ('Logout User'),
  });
});

export {
  createUserAccount, logOutUser, loginUser
};