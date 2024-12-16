const express = require('express')
const router = express.Router();

const { auth, isUser, isAdmin } = require('../middleware/authMiddleware')

const { getAllUser, getDataWithId, createUser, updateUser, deleteUser } = require('../controller/userController')

router.get('/getAllUsers', getAllUser)
router.get('/getUser/:id', getDataWithId)

router.post('/createUser', auth, isAdmin, createUser)

router.put('/updateUser/:id', auth, isAdmin, updateUser)

router.delete('/deleteUser/:id', auth, isAdmin, deleteUser)


module.exports = router;