const { createUser, getAllUsers,  deleteAllUsers, authUser, updatePersonalData, updatePassword } = require('../Controllers/userscontroller')

const userRouter = require('express').Router()

//console.log("try create", addUser)

userRouter.post('/users/create', createUser)
userRouter.post('/users/login', authUser)
userRouter.post('/users/update/personal', updatePersonalData)
userRouter.post('/users/update/password', updatePassword)

//userRouter.post('/users', addUser)
userRouter.get('/users', getAllUsers)
userRouter.delete('/users', deleteAllUsers)

module.exports = userRouter