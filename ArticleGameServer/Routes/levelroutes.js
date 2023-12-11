const { getLevelData} = require('../Controllers/levelcontroller')

const levelRouter = require('express').Router()

const { validateAccessToken } = require('../jwtutils')

levelRouter.get('/level', validateAccessToken, getLevelData)

//dev


module.exports = levelRouter