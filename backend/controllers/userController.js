const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin
    })
  } else {
    res.status(400)
    throw new error('Invalid user data')
  }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // Check user and passwords match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    isAdmin: user.isAdmin,
  }
  res.status(200).json(user)
})

// @desc    Get admins
// @route   /api/users/admins
// @access  Private
const getAdmins = asyncHandler(async (req, res) => {
  if (!req.user.isSuperAdmin) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const users = await User.find({ isAdmin: true }).select('-password')

  res.status(200).json(users)
})

// @desc    Demote a user
// @route   PUT /api/users/:id
// @access  Private
const demote = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (!req.user.isSuperAdmin) {
    res.status(401)
    throw new Error('Not Authorized')
  }

  if (user.isSuperAdmin) {
    res.status(404)
    throw new Error('Cannot Demote Super Admin')
  }

  const updateFields = {
    isAdmin: !user.isAdmin
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  )

  res.status(200).json(updatedUser)
})

// @desc    Get users
// @route   /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  if (!req.user.isSuperAdmin) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const users = await User.find().select('-password')

  res.status(200).json(users)
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAdmins,
  demote,
  getUsers
}
