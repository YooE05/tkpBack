const jwt = require('jsonwebtoken')
require('dotenv').config()

 const getNewAccessToken = (enterUsername)=>
{
    return jwt.sign( { username: enterUsername}, process.env.ACCESS_TOKEN_SECRET)
}

const verifyAccessToken = (req, res, next)=>
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, jwtData)=>
    { 
        if(err) return res.sendStatus(403)
        req.body.username = jwtData.username
        next()
    })
}


module.exports = { getNewAccessToken, validateAccessToken: verifyAccessToken }