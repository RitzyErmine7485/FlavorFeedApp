const express = require('express')
const router = express.Router()

const { protect } = require('../middleware/authMiddleware')
const { login, register, showdata, updateUser, deleteUser, getNameById } = require('../controllers/userController')

router.post('/login', login)
router.post('/register', register)
router.get('/show-data', protect, showdata)
router.route('/:id').put(protect, updateUser).delete(protect, deleteUser)
router.get('/:id', getNameById)

module.exports = router