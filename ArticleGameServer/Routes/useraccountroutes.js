const { createUser, deleteAccount, authUser, updatePersonalData, updatePassword, deleteAllUsers } = require('../Controllers/useraccountcontroller')

const userAccountRouter = require('express').Router()

const { validateAccessToken } = require('../jwtutils')


userAccountRouter.post('/users/create', createUser)
userAccountRouter.post('/users/login', authUser)
userAccountRouter.post('/users/update/personal', validateAccessToken, updatePersonalData)
userAccountRouter.post('/users/update/password', validateAccessToken, updatePassword)

userAccountRouter.delete('/users/deleteuser', validateAccessToken, deleteAccount)

//dev
userAccountRouter.delete('/users', deleteAllUsers)

module.exports = userAccountRouter