const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getAdmins,
  demote,
  getUsers
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/admins', protect, getAdmins)
router.put('/:id', protect, demote)
router.get('/', protect, getUsers)

module.exports = router
