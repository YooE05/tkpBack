const bcrypt = require('bcrypt')

const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')
const SchUserCreds = require('../Models/Schemas/schusercreditionals')

const FormatUtils = require('../formatutils')
const {getNewAccessToken} = require('../jwtutils')


const InitUserData = require('../Models/Contracts/inituserdata')
const UserCreds = require('../Models/Contracts/usercreditionals')
const UserPersonal = require('../Models/Contracts/userpersonaldata')
const UserRegisterData = require('../Models/Contracts/userregistrationdata')

const servCreateCreds = async (creds) => {

    const hashedPassword = await servHashPassword(creds.password)
    const schUserCreds = new SchUserCreds({ username: creds.username, password: hashedPassword })

    return await schUserCreds.save() 
}

const servHashPassword = async (password) => {

    return await bcrypt.hash(password, 10)
}

const servSaveCreds = async (schCreds) => {

    return await schCreds.save() 
}

const servCreatePersonal = async (regData) => {

    const schUserPersonal = new SchUserPersonalData({
        username: regData.userCreds.username,
        name: regData.userPersonal.name,
        surname:  regData.userPersonal.surname,
        points: 0,
        crntlvl: 0,
        timeStamp: Date.now()
    })

    return await schUserPersonal.save()
}

const servSavePersonal = async (schUserPersonal) => {

    return await schUserPersonal.save()
}

const servGetUserCreds = async (reqUsername) => {

    return await SchUserCreds.findOne({ username: reqUsername })
}

const servComparePassword = async (enterPassword, correctPassword) => {

    return await bcrypt.compare(enterPassword, correctPassword)
}

const servGetUserPersonal = async (reqUsername) => {

    return await SchUserPersonalData.findOne({ username: reqUsername })
}


const servDeleteAccount = async (reqUsername) => {
    await SchUserCreds.deleteMany({ username: reqUsername })
    return await SchUserPersonalData.deleteMany({ username: reqUsername })  
}


//dev functions

const deleteAllUsers = async () => {
    await SchUserCreds.deleteMany({})
    await SchUserPersonalData.deleteMany({})
}

async function deletUserByUsername(delusername) {
    await SchUserCreds.deleteMany({ username: delusername })
    await SchUserPersonalData.deleteMany({ username: delusername })
}


module.exports = {
    servSaveCreds,
    servHashPassword,
    servSavePersonal,
    servGetUserCreds,
    servGetUserPersonal,
    servComparePassword,
    servCreateCreds,
    servCreatePersonal,
    servDeleteAccount,
    deleteAllUsers
}