const User = require('../models/user.model');
const { signToken } = require('../utils/jwt');

const register = async ({ username, email, password }) => {
  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new Error('Email already registered');

  const existingUsername = await User.findOne({ username });
  if (existingUsername) throw new Error('Username already taken');

  const user = await User.create({ username, email, password });

  const token = signToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = signToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  register,
  login,
  getMe
};
