const { updateProgress, getLeaders } = require('../Controllers/userprogresscontroller')

const userProgressRouter = require('express').Router()

const { validateAccessToken } = require('../jwtutils')


userProgressRouter.post('/users/update/progress', validateAccessToken, updateProgress)
userProgressRouter.get('/users/leaders', validateAccessToken, getLeaders)

//dev


module.exports = userProgressRouter